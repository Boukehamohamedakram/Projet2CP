#!/bin/bash

sudo apt update
sudo apt install -y nginx hostapd dnsmasq

sudo cp /home/pi/Projet2CP/app/app.apk /var/www/html/
sudo cp /home/pi/Projet2CP/app/app.ipa /var/www/html/

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Download the App</title>
</head>
<body>
    <h1>Download the App</h1>
    <h2>Android</h2>
    <p>Click the link below to download the APK for Android:</p>
    <a href='http://192.168.1.1/app.apk' download>Download for Android</a>
    <h2>iOS</h2>
    <p>Click the link below to download the IPA for iOS:</p>
    <a href='http://192.168.1.1/app.ipa' download>Download for iOS</a>
</body>
</html>" | sudo tee /var/www/html/index.html

sudo systemctl restart nginx
