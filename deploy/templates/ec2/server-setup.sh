#!/bin/sh
set -e

sudo yum update -y
sudo yum install -y docker

sudo service docker start
sudo chkconfig docker on # auto restart docker

# sudo systemctl enable docker.service
# sudo systemctl start docker.service

sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo usermod -aG docker ec2-user # Add user to "docker" group for permissions

cd ~

# TODO: Create network docker-compose file, link to :80

sudo yum install -y git
git clone https://github.com/ufosc/Jukebox-Server.git

sudo docker-compose -f ./Jukebox-Server/docker-compose.yml build
sudo docker-compose -f ./Jukebox-Server/docker-compose.yml up -d

