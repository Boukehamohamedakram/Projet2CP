#!/bin/bash

# Update the package list and install Nginx
sudo apt update
sudo apt install -y nginx

sudo rm /etc/nginx/sites-enabled/default

sudo cp ./config/nginx.conf /etc/nginx/sites-available/frontend

sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/

sudo cp -r ./node_modules/axios/dis/* /var/www/frontend/

sudo systemctl restart nginx

sudo systemctl status nginx
