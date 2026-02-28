#!/bin/bash

echo "Updating system..."
sudo apt update -y

echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

echo "Configuring PostgreSQL for remote access..."

PG_CONF=$(sudo find /etc/postgresql -name postgresql.conf)
PG_HBA=$(sudo find /etc/postgresql -name pg_hba.conf)

sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" $PG_CONF

echo "host all all 10.0.2.0/24 md5" | sudo tee -a $PG_HBA

sudo systemctl restart postgresql

echo "Creating database and user..."

sudo -u postgres psql <<EOF
CREATE DATABASE medusa;
CREATE USER medusauser WITH PASSWORD 'StrongPassword123';
GRANT ALL PRIVILEGES ON DATABASE medusa TO medusauser;
EOF

echo "PostgreSQL setup completed."
