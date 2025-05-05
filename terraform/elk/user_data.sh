#!/bin/bash
set -e

# Update system and install dependencies
apt update && apt upgrade -y
apt install -y openjdk-17-jdk wget apt-transport-https gnupg curl unzip

# Add Elastic GPG key and repo
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
echo "deb https://artifacts.elastic.co/packages/9.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-9.x.list
apt update

# Install Elasticsearch, Logstash, Kibana
apt install -y elasticsearch kibana logstash

# Enable and start services
systemctl enable elasticsearch
systemctl start elasticsearch

systemctl enable kibana
systemctl start kibana

systemctl enable logstash
systemctl start logstash

# Optional: Allow Elasticsearch and Kibana to bind to public IP (security warning if you expose)
# echo "network.host: 0.0.0.0" >> /etc/elasticsearch/elasticsearch.yml
# echo "server.host: 0.0.0.0" >> /etc/kibana/kibana.yml

# Firewall is managed by AWS Security Group, so nothing to open here