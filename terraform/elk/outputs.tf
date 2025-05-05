output "elk_public_ip" {
  value = aws_instance.elk_instance.public_ip
}