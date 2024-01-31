#!/bin/sh
set -e

sudo yum update -y

sudo amazon-linux-extras install -y docker
sudo systemctl enable docker.service
sudo systemctl start docker.service

sudo yum install docker-compose

sudo usermod -aG docker ec2-user # Add user to "docker" group for permissions

sudo yum install git
git clone https://github.com/ufosc/Jukebox-Server.git

docker-compose -f ./Jukebox-Server/docker-compose.yml build
docker-compose -f ./Jukebox-Server/docker-compose.yml up -d

