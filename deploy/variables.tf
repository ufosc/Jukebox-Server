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

variable "SERVER__NODE_ENV" {
  default = "production"
}
variable "SERVER__PORT" {
  default = "8000"
}
variable "SERVER__HOST" {
  default = "0.0.0.0"
}
variable "SERVER__JWT_SECRET_KEY" {
  description = "Random string used to encrypt JWT token."
}
variable "SERVER__TOKEN_HEADER_KEY" {
  default = "Authorization"
}
# 
variable "SERVER__SP_ID" {
  description = "Spotify App ID"
}
variable "SERVER__SP_SECRET" {
  description = "Spotify App Secret"
}

variable "DB__MONGO_USER" {
  description = "MongoDB Username"
}
variable "DB__MONGO_PASSWORD" {
  description = "MongoDB Password"
}

# variable "SERVER__MONGO_URI" {
#   default = "mongodb://${var.DB__MONGO_USER}:${var.DB__MONGO_PASSWORD}@mongodb:27017"
# }

