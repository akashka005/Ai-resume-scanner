#!/bin/bash

# Update the system
sudo apt-get update -y

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: Docker is not installed. Installing Docker...'
  sudo apt-get install -y docker.io
  sudo systemctl start docker
  sudo systemctl enable docker
  sudo usermod -aG docker $USER
fi

# Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: Docker Compose is not installed. Installing Docker Compose...'
  sudo apt-get install -y docker-compose
fi

# Pull the latest changes from GitHub
# Note: You need to have the repo cloned on the EC2 instance
git pull origin main

# Restart the containers
docker-compose down
docker-compose up -d --build

echo "Deployment complete! App is running."
