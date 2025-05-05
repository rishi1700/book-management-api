variable "region" {
  default = "us-east-1"
}

variable "ami_id" {
  default = "ami-0fc5d935ebf8bc3bc" # Ubuntu 20.04 (HVM), SSD
}

variable "instance_type" {
  default = "t3.medium"
}

variable "key_name" {
  description = "EC2 Key pair name"
}

variable "my_ip_cidr" {
  description = "Your IP in CIDR format"
}