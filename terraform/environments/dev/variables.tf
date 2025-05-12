variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-west-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "AWS Availability Zone"
  type        = string
  default     = "eu-west-1a"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of the existing EC2 Key Pair"
  type        = string
}

variable "instance_ami" {
  description = "AMI ID for EC2 instance"
  type        = string
}

variable "project_name" {
  description = "Project name prefix for resource naming"
  type        = string
  default     = "book-api"
}

variable "public_key_path" {
  description = "Path to your public key file (optional, only needed if you're creating a new key pair)"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "ssh_allowed_ips" {
  description = "List of IPs allowed to SSH into EC2 instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
variable "github_user" {
  description = "GitHub username for the repo"
  type        = string
}