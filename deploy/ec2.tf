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
# data "template_file" "server_init_script" {
#   template = file("./templates/ec2/server-setup.sh")

#   vars = {
#     NODE_ENV = var.server_env["NODE_ENV"]
#     PORT = var.server_env["PORT"]
#     HOST = var.server_env["HOST"]
#     JWT_SECRET_KEY = var.server_env["JWT_SECRET_KEY"]
#     TOKEN_HEADER_KEY = var.server_env["TOKEN_HEADER_KEY"]
#     MONGO_URI = var.server_env["MONGO_URI"]
#     SP_ID = var.server_env["SP_ID"]
#     SP_SECRET = var.server_env["SP_SECRET"]
#   }
# }

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
  ami           = data.aws_ami.amzn_linux_2.id
  instance_type = "t3.micro"
  # user_data                   = file("./templates/ec2/server-setup.sh")
  # user_data                   = data.template_file.server_init_script.rendered
  user_data = templatefile("${path.module}/templates/ec2/server-setup.sh.tpl", { env = {
    NODE_ENV         = var.SERVER__NODE_ENV
    PORT             = var.SERVER__PORT
    HOST             = var.SERVER__HOST
    JWT_SECRET_KEY   = var.SERVER__JWT_SECRET_KEY
    TOKEN_HEADER_KEY = var.SERVER__TOKEN_HEADER_KEY
    MONGO_URI        = var.SERVER__MONGO_URI
    SP_ID            = var.SERVER__SP_ID
    SP_SECRET        = var.SERVER__SP_SECRET
  } })
  key_name                    = var.ssh_key_name
  user_data_replace_on_change = true

  subnet_id                   = aws_subnet.public_a.id
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
  egress {
    protocol    = "tcp"
    from_port   = 8080
    to_port     = 8080
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    protocol    = "tcp"
    from_port   = 8000
    to_port     = 8000
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

