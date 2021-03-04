import re
from server.database.scan import Scan, database
from server.api.models import SCAN_FIELDS
from server.queue import scan_queue
from flask import Flask
from flask_restful import Resource, reqparse, marshal, request, abort
from typing import List


def getDeltaPorts(current: Scan, other: Scan):
    if other is None:
        return {"add": current.ports, "remove": ""}

    new_ports = set(current.ports.split(","))
    old_ports = set(current.ports.split(","))

    addition = ",".join([port for port in new_ports if port not in old_ports])
    removal = ",".join([port for port in old_ports if port not in new_ports])

    return {"add": addition, "remove": removal} if addition or removal else None


class ScanApi(Resource):
    def __init__(self, *args, **kwargs):
        super(ScanApi, self, *args, **kwargs)

    def get(self, id: str) -> dict:
        scan = Scan.query.get(id)
        if not scan:
            abort(404)

        output = {"scan": marshal(scan, SCAN_FIELDS)}

        previous_scan = (
            Scan.query.filter(Scan.address == scan.address, Scan.created_date < scan.created_date)
            .order_by(Scan.created_date.desc())
            .first()
        )

        if previous_scan:
            output["previous_scan"] = marshal(previous_scan, SCAN_FIELDS)["uri"]

        delta = getDeltaPorts(scan, previous_scan)
        if delta:
            output["delta_ports"] = delta

        return output


class ScanListApi(Resource):
    def __init__(self, *args, **kwargs):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument("addresses", type=list, location="json", help="No addresses provided!")
        super(ScanListApi, self, *args, **kwargs)

    def get(self) -> List[dict]:
        page = int(request.args.get("page", "1"))
        page_size = int(request.args.get("page_size", "10"))
        scans = Scan.query.order_by(Scan.created_date.desc()).paginate(page, page_size, error_out=False)

        return {
            "scans": [marshal(scan, SCAN_FIELDS) for scan in scans.items],
            "next": scans.has_next,
            "page": scans.page,
            "pages": scans.pages,
            "total": scans.total,
        }

    def post(self) -> dict:
        addresses = set(self.reqparse.parse_args()["addresses"])
        scans = []
        existing_scans = []

        for address in addresses:
            if not address or not re.match(r"^[a-zA-Z0-9\.]+$", address):
                abort(400)

            existing_scan = Scan.query.filter_by(address=address, ports=None).order_by(Scan.created_date.desc()).first()

            if existing_scan:
                # redrive on empty queue
                if not len(scan_queue):
                    scans.append(existing_scan)
                else:
                    existing_scans.append(existing_scan)

                continue

            scan = Scan(address=address)
            database.session.add(scan)
            scans.append(scan)

        database.session.commit()

        for scan in scans:
            scan_queue.add_scan_to_queue(scan)

        return {"scans": [marshal(scan, SCAN_FIELDS) for scan in [*scans, *existing_scans]]}, 201


class ScanByAddressApi(Resource):
    def __init__(self, *args, **kwargs):
        super(ScanByAddressApi, self, *args, **kwargs)

    def get(self, address: str) -> List[dict]:
        page = int(request.args.get("page", "1"))
        page_size = int(request.args.get("page_size", "10"))
        scans = (
            Scan.query.filter_by(address=address)
            .order_by(Scan.created_date.desc())
            .paginate(page, page_size, error_out=False)
        )

        return {
            "scans": [marshal(scan, SCAN_FIELDS) for scan in scans.items],
            "next": scans.has_next,
            "page": scans.page,
            "pages": scans.pages,
            "total": scans.total,
        }
