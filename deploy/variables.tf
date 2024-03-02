variable "prefix" {
  default = "jbx"
}

variable "project" {
  default = "jukebox"
}

variable "contact" {
  default = "web@ikehunter.dev"
}

# variable "ssh_auth" {
#   type = map(string)
  
#   default = {
#     key_pair = {
#       description = "Key pair used to log into EC2 server."
#     }
    
#     public_key = {
#       description = "Public key used to log into EC2 server."
#     }
#   }
# }

variable "ssh_key_name" {
  description = "Key pair used to log into EC2 server."
}

# variable "ssh_public_key" {
#   description = "Public key used to log into EC2 server."
# }