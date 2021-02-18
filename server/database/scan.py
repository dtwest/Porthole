import uuid
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy_utils import UUIDType
from flask_sqlalchemy import SQLAlchemy
from server.database.constants import database_connection_uri, database_server_connection_uri, database_name


database = SQLAlchemy()


class Scan(database.Model):
    id = database.Column(UUIDType(binary=False), primary_key=True)
    address = database.Column(database.String(255))
    ports = database.Column(database.TEXT(65535), default=None)  # VARCHAR(MAX)
    created_date = database.Column(database.DateTime(timezone=True))

    def __init__(self, address: str):
        self.id = uuid.uuid4()
        self.address = address
        self.created_date = datetime.utcnow()