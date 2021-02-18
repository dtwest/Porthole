#!/bin/bash
docker stop pickle
docker stop mysqldb
docker rm pickle
docker rm mysqldb

docker volume rm mysql
docker volume rm mysql_config
docker volume rm porthole_mysql
docker volume rm porthole_mysql_config
docker network rm pickle_net