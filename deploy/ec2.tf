/**
ELASTIC COMPUTE CLOUD (EC2) CONFIGURATION.

We will use EC2 as a server to host our server on AWS. This
is the easiest resource to create in AWS, and will only need:
- EC2 Instance
- Script template (optional, but helps with organization)
*/
##########################################
# EC2 INSTANCE - Host Server Application #
##########################################
data "aws_ami" "amzn_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.3.*-kernel-6.1-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}


resource "aws_instance" "jukebox_server" {
  ami                         = data.aws_ami.amzn_linux_2.id
  instance_type               = "t3.micro"
  user_data                   = file("./templates/ec2/server-setup.sh")
  key_name                    = var.ssh_key_name
  subnet_id                   = aws_subnet.public_a.id
  user_data_replace_on_change = true

  vpc_security_group_ids = [
    aws_security_group.jukebox_server.id
  ]


  tags = merge(
    local.common_tags,
    tomap({ Name = "${local.prefix}-server" })
  )
}


resource "aws_security_group" "jukebox_server" {
  description = "Control server inbound and outbound access."
  name        = "${local.prefix}-server"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

