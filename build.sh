#!/bin/bash
mkdir -p ./build

cp ./client/* ./build

docker build --tag porthole .