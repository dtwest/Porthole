import asyncio
import logging
import nmap3
import threading
import sqlalchemy
from sqlalchemy.orm import sessionmaker, scoped_session
from server.database.scan import Scan, database
from server.database.constants import database_connection_uri

log = logging.getLogger('gunicorn.error')


class ScanQueue:
    _queue: asyncio.Queue
    _event_loop: asyncio.AbstractEventLoop
    _loop_thread: threading.Thread
    listening: bool
    max_concurrent: int

    def __init__(self, max_concurrent: int = 10):
        self.max_concurrent = max_concurrent
        self.listening = True
        self._queue = asyncio.Queue()
        self._event_loop = asyncio.get_event_loop()
        self._loop_thread = threading.Thread(target=self._loop, args=(self._event_loop,))
        self._loop_thread.start()

    def _loop(self, loop: asyncio.AbstractEventLoop) -> None:
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.listen_for_scans())

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
        log.info(f'Adding scan request for "{scan.address}" onto the queue.')
        self._event_loop.call_soon_threadsafe(self._queue.put_nowait, scan)

    async def listen_for_scans(self) -> None:
        while self.listening:
            try:
                tasks = []
                for _ in range(min(self.max_concurrent, max(1, self._queue.qsize()))):
                    item = await self._queue.get()
                    tasks.append(asyncio.create_task(self.handle_item(item)))

                await asyncio.gather(*tasks)
            except Exception as e:
                log.error('Error when processing events in queue!', exec_info=e)

    async def handle_item(self, item: Scan) -> None:
        log.info(f'Initiating scan for "{item.address}"')
        nmap = nmap3.NmapScanTechniques()
        session = self._scoped_session()

        # Change this to nmap.nmap_syn_scan(address, '-p-')
        # to scan all ports in a sane time... if you have root access
        # but for this app we'll scan the top 1000 ports using tcp scan
        results = nmap.nmap_tcp_scan(item.address)
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
        self._loop_thread.join()
