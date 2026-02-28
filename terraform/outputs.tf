output "vm1_public_ip" {
  value = azurerm_public_ip.vm1_pip.ip_address
}

output "vm1_private_ip" {
  value = azurerm_network_interface.nic1.private_ip_address
}

output "vm2_private_ip" {
  value = azurerm_network_interface.nic2.private_ip_address
}

output "vm3_private_ip" {
  value = azurerm_network_interface.nic3.private_ip_address
}