#!/bin/bash

DB_IP="10.0.3.4"   # CHANGE THIS
DB_USER="medusauser"
DB_PASS="StrongPassword123"

echo "Updating system..."
sudo apt update -y

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

echo "Installing Medusa CLI..."
sudo npm install -g @medusajs/medusa-cli

echo "Creating Medusa backend..."
medusa new medusa-backend --seed

cd medusa-backend

echo "Configuring environment..."

cat > .env <<EOL
DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@${DB_IP}:5432/medusa
PORT=9000
EOL

echo "Building Medusa..."
npm install
npm run build

echo "Installing PM2..."
sudo npm install -g pm2

pm2 start npm --name "medusa-backend" -- start
pm2 startup
pm2 save

echo "Medusa backend setup completed."
