from server.database.scan import Scan, database
from server.api.models import SCAN_FIELDS
from server.queue import scan_queue
from flask import Flask
from flask_restful import Resource, reqparse, marshal, request, abort
from typing import List

class ScanApi(Resource):
    def __init__(self, *args, **kwargs):
        super(ScanApi, self, *args, **kwargs)

    def get(self, id: str) -> dict:
        scan = Scan.query.get(id)
        if not scan:
            abort(404)

        return { "scan": marshal(scan, SCAN_FIELDS) }

class ScanListApi(Resource):
    def __init__(self, *args, **kwargs):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument("addresses", type=list, location="json", help='No addresses provided!')
        super(ScanListApi, self, *args, **kwargs)

    def get(self) -> List[dict]:
        page = int(request.args.get('page', '1'))
        page_size = int(request.args.get('page_size', '10'))
        scans = Scan.query.order_by(Scan.created_date.desc()).paginate(page, page_size, error_out=False)

        return {
            "scans": [marshal(scan, SCAN_FIELDS) for scan in scans.items],
            "next": scans.has_next
        }
    
    def post(self) -> dict:
        addresses = self.reqparse.parse_args()['addresses']
        scans = []

        for address in addresses:
            if not address:
                abort(400) # theoretically someone can submit null as a value

            scan = Scan(address=address)
            database.session.add(scan)
            scans.append(scan)

        database.session.commit()
        
        for scan in scans:
            scan_queue.add_scan_to_queue(scan)

        return { "scans": [marshal(scan, SCAN_FIELDS) for scan in scans]}, 201

class ScanByAddressApi(Resource):
    def __init__(self, *args, **kwargs):
        super(ScanByAddressApi, self, *args, **kwargs)

    def get(self, address: str) -> List[dict]:
        page = int(request.args.get('page', '1'))
        page_size = int(request.args.get('page_size', '10'))
        scans = Scan.query.filter_by(address=address).order_by(Scan.created_date.desc()).paginate(page, page_size, error_out=False)

        return {
            "scans": [marshal(scan, SCAN_FIELDS) for scan in scans.items],
            "next": scans.has_next
        }

