#!/bin/bash
mkdir -p ./build

cd ./client || return 1
npm  run build
cd - || return 1

docker build --tag porthole .