output "server_host" {
  value = aws_instance.jukebox_server.public_dns
}