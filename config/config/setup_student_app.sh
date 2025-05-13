#!/bin/bash

sudo apt update
sudo apt install -y nginx hostapd dnsmasq

sudo cp /home/pi/Projet2CP/app/app-debug.apk /var/www/html/
sudo cp "/home/pi/Projet2CP/app/FlutterIpaExport(1).ipa" /var/www/html/

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
    <a href='http://192.168.1.1/app-debug.apk' download>Download for Android</a>
    <h2>iOS</h2>
    <p>Click the link below to download the IPA for iOS:</p>
    <a href='http://192.168.1.1/FlutterIpaExport%281%29.ipa' download>Download for iOS</a>
</body>
</html>" | sudo tee /var/www/html/index.html

sudo systemctl restart nginx
