from flask import Flask, render_template, json
from flask_restful import Api
from werkzeug.exceptions import HTTPException, BadRequest
from server.database import init_database
from server.api import ScanApi, ScanListApi, ScanByAddressApi

app = Flask(__name__, static_folder="client/build/static", template_folder="client/build")
api = Api(app)
init_database(app)


@app.route("/")
@app.route("/<path:catch_all>")
def home(*args, **kwargs):
    return render_template("index.html")


api.add_resource(ScanListApi, "/api/v1.0/scans", endpoint="scans")
api.add_resource(ScanApi, "/api/v1.0/scans/<string:id>", endpoint="scan")
api.add_resource(ScanByAddressApi, "/api/v1.0/scans/address/<string:address>", endpoint="scanByAddress")


@app.errorhandler(HTTPException)
def handle_exception(e: HTTPException):
    response = e.get_response()
    response.data = json.dumps(
        {
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }
    )
    response.content_type = "application/json"
    return response
