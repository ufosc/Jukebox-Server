#!/bin/bash
set -e # Exit if a command yields a non-zero exit code

# Update yum and install Docker onto the EC2 server
sudo yum update -y
sudo yum install -y docker

# Start up Docker
sudo service docker start
sudo chkconfig docker on # auto restart docker

# Install Docker Compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo usermod -aG docker ec2-user # Add user to "docker" group for permissions

# Install git
sudo yum install -y git 

# Jukebox-Server Configuration ========================
git clone https://github.com/ufosc/Jukebox-Server.git /home/ec2-user/Jukebox-Server
echo "# Environment Variables, created by terraform on $(date)" > /home/ec2-user/Jukebox-Server/.env

%{ for env_key, env_value in env }
echo "${env_key}=${env_value}" >> /home/ec2-user/Jukebox-Server/.env
%{ endfor ~}


sudo docker-compose -f /home/ec2-user/Jukebox-Server/docker-compose.prod.yml up -d --build

# Jukebox-Frontend Configuration ======================
git clone https://github.com/ufosc/Jukebox-Frontend.git /home/ec2-user/Jukebox-Frontend
sudo docker-compose -f /home/ec2-user/Jukebox-Frontend/docker-compose.network.yml run --rm client sh -c "npm run build" --build




