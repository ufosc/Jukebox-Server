/**
ELASTIC COMPUTE CLOUD (EC2) CONFIGURATION.

We will use EC2 as a server to host our server on AWS. This
is the easiest resource to create in AWS, and will only need:
- EC2 Instance
- Script template (optional, but helps with organization)
*/
###################################################
# SETUP SCRIPT - Configure EC2 Server for Project #
###################################################
data "aws_ami" "amzn_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-kernel-5.10-hvm-2.*"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}
resource "aws_instance" "jukebox_server" {
  ami           = data.aws_ami.amzn_linux_2.id
  instance_type = "t3.micro"


  tags = merge(
    local.common_tags,
    tomap({ Name = "${local.prefix}-server" })
  )
}

##########################################
# EC2 INSTANCE - Host Server Application #
##########################################
# TODO: Create ec2 instance with Amazon Linux 2 ami
# TODO: connect script
