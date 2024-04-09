variable "do_token" {
  type        = string
  description = "DigitalOcean token"
}

variable "prefix" {
  type        = string
  description = "Prefix for resource names"
}

variable "vpc_cidr_block" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "cluster_name" {
  type = string
}

variable "retention_days" {
  type = number
}

variable "desired_size" {
  type = number
}

variable "max_size" {
  type = number
}

variable "min_size" {
  type = number
}