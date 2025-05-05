# terraform/elk/main.tf
provider "aws" {
  region = var.region
}

resource "aws_vpc" "elk_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "elk-vpc"
  }
}

resource "aws_subnet" "elk_subnet" {
  vpc_id                  = aws_vpc.elk_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "elk-subnet"
  }
}

resource "aws_internet_gateway" "elk_igw" {
  vpc_id = aws_vpc.elk_vpc.id

  tags = {
    Name = "elk-igw"
  }
}

resource "aws_route_table" "elk_route_table" {
  vpc_id = aws_vpc.elk_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.elk_igw.id
  }

  tags = {
    Name = "elk-route-table"
  }
}

resource "aws_route_table_association" "elk_rta" {
  subnet_id      = aws_subnet.elk_subnet.id
  route_table_id = aws_route_table.elk_route_table.id
}

resource "aws_security_group" "elk_sg" {
  name        = "elk-sg"
  description = "Allow ELK traffic"
  vpc_id      = aws_vpc.elk_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip_cidr]
  }

  ingress {
    from_port   = 9200
    to_port     = 9200
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5601
    to_port     = 5601
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5044
    to_port     = 5044
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "elk_instance" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_name
  subnet_id                   = aws_subnet.elk_subnet.id
  vpc_security_group_ids      = [aws_security_group.elk_sg.id]
  associate_public_ip_address = true

  user_data = file("${path.module}/user_data.sh")

  tags = {
    Name = "elk-instance"
  }
}
