terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.36.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }

  backend "s3" {
    bucket  = "passin-tfstate"
    key     = "state/terraform.tfstate"
    region  = "us-east-2"
    encrypt = true
  }
}

provider "digitalocean" {
  token = var.do_token
}

provider "aws" {
  region = "us-east-2"
}
