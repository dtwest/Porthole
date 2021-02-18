from flask_restful import fields

SCAN_FIELDS = {
    "address": fields.String,
    "ports": fields.String,
    "created_date": fields.DateTime,
    "uri": fields.Url("scan"),
}
