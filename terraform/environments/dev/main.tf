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
              sudo apt update -y
              curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
              sudo apt-get install -y nodejs git
              sudo npm install -g pm2
              git clone https://github.com/${var.github_user}/book-management-api.git
              cd book-management-api
              npm install
              pm2 start src/app.js --name book-api
              pm2 save
              EOF

  tags = {
    Name = "nodejs-api-server"
  }
}