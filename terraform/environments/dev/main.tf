#
provider "aws" {
  region = var.aws_region
}
data "aws_vpc" "default" {
  default = true
}
resource "aws_security_group" "nodejs_sg" {
  name        = "nodejs_sg"
  description = "Allow HTTP and SSH"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nodejs-sg"
  }
}
resource "aws_subnet" "public" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}
resource "aws_instance" "nodejs_app" {
  ami                         = var.instance_ami
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.nodejs_sg.id]
  associate_public_ip_address = true
  key_name                    = var.key_name

  user_data = <<-EOF
              #!/bin/bash

              # Update and install required packages
              sudo apt update -y
              curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
              sudo apt-get install -y nodejs git mysql-server

              # Start and configure MySQL with root password
              sudo systemctl start mysql
              sudo systemctl enable mysql
              sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd'; FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS book_management;"

              # Install PM2 globally
              sudo npm install -g pm2

              # Clone your Node.js app
              git clone https://github.com/${var.github_user}/book-management-api.git
              cd book-management-api

              # Create .env file for DB config
              cat <<EOT >> .env
              DB_USER=root
              DB_PASS=P@ssw0rd
              DB_NAME=book_management
              DB_HOST=127.0.0.1
              DB_PORT=3306
              JWT_SECRET=my_secret_key
              NODE_ENV=production
              EOT
              # Install dependencies without triggering postinstall scripts
              npm install --ignore-scripts
              # Create logs directory with proper ownership
              mkdir -p logs
              chown -R ubuntu:ubuntu logs
              # Create PM2 ecosystem config file
              cat <<EOT >> ecosystem.config.js
              module.exports = {
                apps: [{
                  name: "book-api",
                  script: "src/app.js",
                  env: {
                    DB_USER: "root",
                    DB_PASS: "P@ssw0rd",
                    DB_NAME: "book_management",
                    DB_HOST: "127.0.0.1",
                    DB_PORT: "3306",
                    JWT_SECRET: "my_secret_key",
                    NODE_ENV: "production"
                  }
                }]
              }
              EOT

              # Create post-boot setup script for PM2
              cat <<EOT >> /home/ubuntu/setup-app.sh
              #!/bin/bash
              cd /home/ubuntu/book-management-api
              /usr/bin/pm2 start ecosystem.config.js
              /usr/bin/pm2 save
              /usr/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
              EOT

              chown -R ubuntu:ubuntu /home/ubuntu/book-management-api
              chmod +x /home/ubuntu/setup-app.sh
              chown ubuntu:ubuntu /home/ubuntu/setup-app.sh

              # Add to crontab for execution on reboot
              crontab -l > mycron || true
              echo "@reboot /home/ubuntu/setup-app.sh" >> mycron
              crontab mycron
              rm mycron
              EOF

  tags = {
    Name = "nodejs-api-server"
  }
}