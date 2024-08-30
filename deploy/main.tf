terraform {
    backend "s3" {
        bucket = "jukebox-backend"
        key = "jukebox-backend.tfstate"
        region = "us-east-1"
        encrypt = true
        dynamodb_table = "jukebox-backend-tf-state-lock"
    }
}

provider "aws" {
  region = "us-east-2"
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    Owner       = var.contact
    ManagedBy   = "Terraform"
  }
}

data "aws_region" "current" {}