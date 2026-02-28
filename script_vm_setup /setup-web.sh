#!/bin/bash

APP_IP="10.0.2.4"   # CHANGE THIS

echo "Updating system..."
sudo apt update -y

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

echo "Creating Next.js frontend..."
npx create-next-app@latest medusa-frontend --use-npm --yes

cd medusa-frontend

echo "Configuring backend URL..."

cat > .env.local <<EOL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://${APP_IP}:9000
EOL

echo "Building frontend..."
npm install
npm run build

echo "Installing PM2..."
sudo npm install -g pm2

pm2 start npm --name "nextjs-frontend" -- start
pm2 startup
pm2 save

echo "Frontend setup completed."
