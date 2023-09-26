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
  region = "us-east-1"
}