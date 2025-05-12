#!/bin/bash


cd "$(dirname "$0")/../Projet2CP/back end/BackQuiz"


python3 -m venv venv
source venv/bin/activate


pip install --upgrade pip
pip install -r "$(dirname "$0")/../Projet2CP/back end/requirements.txt"


sudo cp "$(dirname "$0")/../systemd/new-backend.service" /etc/systemd/system/


sudo systemctl daemon-reload
sudo systemctl enable new-backend.service
sudo systemctl start new-backend.service


sudo systemctl status new-backend.service
