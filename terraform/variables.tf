variable "location" {
  default = "Central India"
}

variable "resource_group_name" {
  default = "rg-3vm-vnet-lab"
}

variable "vnet_name" {
  default = "vnet-main"
}

variable "address_space" {
  default = ["10.0.0.0/16"]
}

variable "subnets" {
  type = map(string)
  default = {
    subnet1 = "10.0.1.0/24"
    subnet2 = "10.0.2.0/24"
    subnet3 = "10.0.3.0/24"
  }
}

variable "vm_size" {
  default = "Standard_DC1s_v3"
}

variable "admin_username" {
  default = "azureuser"
}

variable "admin_password" {
  default     = "YourStrongPassword123!"
  
}

variable "ssh_source_cidr" {
  description = "CIDR allowed to SSH to vm1 (public). Example: 203.0.113.10/32"
  default     = "0.0.0.0/0"
}
