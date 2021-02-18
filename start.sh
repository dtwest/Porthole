#!/bin/bash
while ! nc -z mysqldb 3306; do sleep 1; done
gunicorn --bind 0.0.0.0:5000 app:app