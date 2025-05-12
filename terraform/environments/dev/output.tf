output "ec2_public_ip" {
  value = aws_instance.nodejs_app.public_ip
}