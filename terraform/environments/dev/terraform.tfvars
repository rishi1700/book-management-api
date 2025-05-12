# AWS region
aws_region = "eu-west-1"

# CIDR blocks for VPC and subnet (safe defaults)
vpc_cidr            = "172.31.0.0/16"
public_subnet_cidr  = "172.31.250.0/24"

# Availability zone within the region
availability_zone   = "eu-west-1a"

# EC2 instance details
instance_type = "t2.micro"

# Your existing AWS key pair name
# 🔍 To find: AWS Console → EC2 → Key Pairs → use 'Name'
key_name            = "book-api-key-eu"


instance_ami = "ami-09079da11cd2861fa"

# Just for tagging and naming resources
project_name = "book-api"

# Optional — only needed if creating a new key pair
public_key_path     = "~/.ssh/book_api_key.pub"

# IPs allowed for SSH (lock to your IP if deploying to prod)
ssh_allowed_ips = ["0.0.0.0/0"]  # 🔐 Replace with your IP if needed


github_user = "rishi1700"