import logging
import nmap3
import sqlalchemy
import concurrent.futures
from typing import Set
from sqlalchemy.orm import sessionmaker, scoped_session
from server.database.scan import Scan, database
from server.database.constants import database_connection_uri

log = logging.getLogger('gunicorn.error')


class ScanQueue:
    _executor: concurrent.futures.ProcessPoolExecutor
    _futures: Set[concurrent.futures.Future]
    listening: bool
    max_concurrent: int

    def __init__(self, max_concurrent: int = 5):
        self.max_concurrent = max_concurrent
        self.listening = True
        self._futures = set()
        self._executor = concurrent.futures.ThreadPoolExecutor(max_workers=self.max_concurrent)

    @property
    def _scoped_session(self) -> sqlalchemy.orm.scoping.scoped_session:
        engine = sqlalchemy.create_engine(database_connection_uri)
        return scoped_session(
            sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=engine
            )
        )
                
    def add_scan_to_queue(self, scan: Scan) -> None:
        log.info(f'Submitting scan request for "{scan.address}" to the executor.')
        future = self._executor.submit(self.handle_item, scan)
        self._futures.add(future)
        
        def remove_from_futures(*args, **kwargs):
            self._futures.remove(future)

        future.add_done_callback(remove_from_futures)

    def handle_item(self, item: Scan) -> None:
        log.info(f'Initiating scan for "{item.address}"')
        nmap = nmap3.NmapScanTechniques()
        session = self._scoped_session()

        # Change this to nmap.nmap_syn_scan(address, '-p-')
        # to scan all ports in a sane time... if you have root access
        # but for this app we'll scan the top 100 ports using tcp scan
        results = nmap.nmap_tcp_scan(item.address, args='-F')
        ports = '-'
        log.info(results['runtime']['summary'])
        for k, v in results.items():
            if k != 'stats' and k != 'runtime':
                ports = ','.join(port['portid'] for port in v['ports'])

        # load item again. so it's persistent in the scoped session
        scan_item = session.query(Scan).get(item.id)

        scan_item.ports = ports
        log.info(f'"{item.address}" has open ports on: {scan_item.ports}')
        session.commit()

    def __del__(self, *args, **kwargs) -> None:
        log.info(f'Stopping the scan queue listener!')
        self.listening = False
        for future in self._futures:
            future.cancel()
        self._executor.shutdown()
