#!/bin/bash

echo "Setting up virtual environment."
python3 -m venv env
. ./env/bin/activate

echo "Installing pip dependencies."
pip3 install -r requirements.txt

echo "Profit! Remember to execute 'deactivate' when you're done!"