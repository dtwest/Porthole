import sqlalchemy
from flask import Flask
from server.database.constants import (
    database_connection_uri,
    database_server_connection_uri,
    database_name,
)
from server.database.scan import database


def init_database(app: Flask):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_connection_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    engine = sqlalchemy.create_engine(database_server_connection_uri)
    with engine.begin() as conn:
        conn.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")

    database.init_app(app)
    with app.app_context():
        database.create_all()
        database.session.commit()
