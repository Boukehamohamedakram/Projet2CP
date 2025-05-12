#!/bin/bash

# Update the package list and install Nginx
sudo apt update
sudo apt install -y nginx

# Remove the default configuration (if any)
sudo rm /etc/nginx/sites-enabled/default

# Copy the Nginx configuration file to the correct location
sudo cp ./config/nginx.conf /etc/nginx/sites-available/frontend

# Enable the site configuration
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/

# Copy the built React frontend to the appropriate directory
sudo cp -r ./frontend/build/* /var/www/frontend/

# Restart Nginx to apply changes
sudo systemctl restart nginx

# Verify that Nginx is running
sudo systemctl status nginx
