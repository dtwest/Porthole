from flask_restful import fields

SCAN_FIELDS = {
    "address": fields.String,
    "ports": fields.String,
    "updated_date": fields.DateTime,
    "created_date": fields.DateTime,
    "uri": fields.Url("scan"),
}
