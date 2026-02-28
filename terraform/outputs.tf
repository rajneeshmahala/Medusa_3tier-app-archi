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

output "ansible_inventory" {
  value = <<EOT
[web]
vm-web ansible_host=${azurerm_public_ip.vm1_pip.ip_address}

[app]
vm-app ansible_host=${azurerm_network_interface.nic2.private_ip_address}

[db]
vm-db ansible_host=${azurerm_network_interface.nic3.private_ip_address}

[private:children]
app
db

[all:vars]
ansible_user=${var.admin_username}
ansible_ssh_private_key_file=~/.ssh/id_rsa

[private:vars]
ansible_ssh_common_args='-o ProxyJump=${var.admin_username}@${azurerm_public_ip.vm1_pip.ip_address}'
EOT
}
#terraform output -raw ansible_inventory > ../ansible_vm_setup/inventory.ini