terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tf-backend"
    storage_account_name = "sttfbackendrajneesh"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}