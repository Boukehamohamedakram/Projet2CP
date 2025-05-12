#!/bin/bash

sudo apt update
sudo apt install -y hostapd dnsmasq

sudo systemctl stop hostapd
sudo systemctl stop dnsmasq

cd Projet2CP 
sudo cp config/hostapd.conf /etc/hostapd/hostapd.conf
sudo cp config/dnsmasq.conf /etc/dnsmasq.conf
sudo cp config/dhcpcd.conf /etc/dhcpcd.conf

sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl enable dnsmasq

sudo reboot
