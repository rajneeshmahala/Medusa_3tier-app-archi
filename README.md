# Azure 3-Tier Medusa Lab (Terraform + Ansible + GitHub Actions)

This project provisions and configures a simple 3-tier architecture on Azure:
- `web` tier: Next.js frontend VM (publicly reachable via jump host)
- `app` tier: Medusa backend VM (private subnet)
- `db` tier: PostgreSQL VM (private subnet)

Infrastructure is created with Terraform under `terraform/`, and app/database setup can be performed with Ansible under `ansible_vm_setup/` (or shell scripts under `script_vm_setup `).

Detailed architecture document: [architure.md](./architure.md)

## Architecture

- Resource Group: `rg-3vm-vnet-lab`
- Region: `Central India` (default)
- VNet CIDR: `10.0.0.0/16`
- Subnets:
  - `subnet1`: `10.0.1.0/24` (web/jump VM)
  - `subnet2`: `10.0.2.0/24` (app VM)
  - `subnet3`: `10.0.3.0/24` (db VM)
- VMs:
  - `vm1-public` in subnet1 with **Public IP**
  - `vm2-private` in subnet2 (private only)
  - `vm3-private` in subnet3 (private only)
- Security:
  - NSG on `vm1` NIC allows inbound SSH (`TCP/22`) from `var.ssh_source_cidr`

## Repository Layout

- `terraform/`: Infrastructure as Code (Azure resources)
- `ansible_vm_setup/`: Inventory, playbook, and roles for app/db/web provisioning
- `script_vm_setup /`: Alternative manual setup scripts (note the folder has a trailing space)
- `.github/workflows/terraform-ci.yml`: CI/CD workflow for Terraform + Azure login + Key Vault integration

## How the Project Works

### 1) Infrastructure provisioning (Terraform)

Terraform creates:
- Resource Group
- Virtual Network + 3 subnets
- One Standard public IP for `vm1`
- One NSG rule for SSH on `vm1`
- Three Linux VMs using Ubuntu 22.04 **Gen2** image (`22_04-lts-gen2`) to match `Standard_DC1s_v3`
- Linux VM login configured with `admin_ssh_key` (public key auth)

Outputs include:
- `vm1_public_ip`
- private IPs for all VMs
- generated `ansible_inventory` content

### 2) Access model

- You SSH directly to `vm1-public` using public IP.
- You SSH to `vm2-private` and `vm3-private` through `vm1` as jump host (`ProxyJump`).

### 3) Configuration model

You can configure workloads in either way:
- Ansible (`ansible_vm_setup/playbook.yml`) with roles:
  - `roles/db`: PostgreSQL install + DB/user setup
  - `roles/app`: Medusa backend install/build/start (PM2)
  - `roles/web`: Next.js frontend install/build/start (PM2)
- Shell scripts in `script_vm_setup ` for manual setup per tier.

## Prerequisites

Install locally:
- Terraform `>= 1.5.0`
- Azure CLI (`az`)
- Ansible (if using Ansible path)
- SSH client (`ssh`, `ssh-keygen`)

Azure prerequisites:
- Azure subscription with permission to create RG/network/VM resources
- Optional for CI: Azure App Registration + Federated Credential for GitHub OIDC
- Optional for CI: Azure Key Vault secret named `vm-ssh-private-key`

## Local Deployment (Terraform)

Run from repo root:

```bash
cd terraform
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply -auto-approve -var "admin_ssh_public_key=$(cat ~/.ssh/id_rsa.pub)"
```

Get outputs:

```bash
terraform output
terraform output -raw vm1_public_ip
terraform output -raw ansible_inventory > ../ansible_vm_setup/inventory.ini
```

## SSH Access

Username default is `azureuser`.

SSH to public VM (`vm1`):

```bash
ssh -i ~/.ssh/id_rsa azureuser@$(cd terraform && terraform output -raw vm1_public_ip)
```

From `vm1`, reach private VMs:

```bash
ssh -i ~/.ssh/id_rsa -J azureuser@$(cd terraform && terraform output -raw vm1_public_ip) azureuser@$(cd terraform && terraform output -raw vm2_private_ip)
ssh -i ~/.ssh/id_rsa -J azureuser@$(cd terraform && terraform output -raw vm1_public_ip) azureuser@$(cd terraform && terraform output -raw vm3_private_ip)
```

If you want tighter SSH security, set allowed source CIDR during apply:

```bash
cd terraform
terraform apply -var 'ssh_source_cidr=YOUR_PUBLIC_IP/32'
```

## Ansible Deployment

1. Generate inventory from Terraform output:

```bash
cd terraform
terraform output -raw ansible_inventory > ../ansible_vm_setup/inventory.ini
```

2. Run playbook:

```bash
cd ../ansible_vm_setup
ansible-playbook -i inventory.ini playbook.yml
```

## GitHub Actions Deployment (Azure)

Workflow file: `.github/workflows/terraform-ci.yml`

Current workflow stages:
- Checkout
- Azure login via OIDC (`azure/login@v2`)
- Fetch SSH private key from Key Vault secret `vm-ssh-private-key`
- Generate public key from fetched private key
- Export `TF_VAR_admin_ssh_public_key` from `~/.ssh/id_rsa.pub`
- Terraform init, validate, plan, apply (`-auto-approve` with `admin_ssh_public_key`)
- Export Ansible inventory
- Install Ansible
- Wait for SSH readiness on `vm1-public`
- Run `ansible-playbook -i inventory.ini playbook.yml`
- Wait 10 minutes
- Terraform destroy

### Required GitHub Secrets

Set these repository secrets:
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

### OIDC Setup (high level)

1. Create Azure AD app registration.
2. Add federated credential for your GitHub repo/branch.
3. Grant required Azure RBAC roles to the service principal.
4. Save the app/subscription IDs as GitHub secrets.

### Key Vault Secret Format Requirement

`vm-ssh-private-key` must contain a valid private key text (multiline preserved), for example an OpenSSH private key block.

Recommended upload method (preserves formatting):

```bash
az keyvault secret set \
  --vault-name kv-rajneesh-prod \
  --name vm-ssh-private-key \
  --file ~/.ssh/id_rsa
```

## Variables

Main Terraform variables in `terraform/variables.tf`:
- `location`
- `resource_group_name`
- `vnet_name`
- `address_space`
- `subnets`
- `vm_size` (default `Standard_DC1s_v3`)
- `admin_username`
- `admin_ssh_public_key`
- `ssh_source_cidr`

Use a custom tfvars file instead of editing defaults:

```bash
cd terraform
cat > custom.tfvars <<'VARS'
admin_ssh_public_key = "ssh-rsa AAAAB3Nza... your-key"
ssh_source_cidr = "YOUR_PUBLIC_IP/32"
VARS

terraform apply -var-file=custom.tfvars
```

## Destroy

```bash
cd terraform
terraform destroy
```

## Troubleshooting

### VM creation error: Hypervisor Generation mismatch

If using `Standard_DC1s_v3`, image must be Gen2.
This project already uses:
- `offer = "0001-com-ubuntu-server-jammy"`
- `sku = "22_04-lts-gen2"`

### Cannot SSH to `vm1`

Check:
- NSG rule exists for inbound `TCP/22`
- `ssh_source_cidr` allows your IP
- Public IP is attached to `vm1`

### `ssh-keygen` / `libcrypto` error in CI

Usually Key Vault secret format issue.
Re-upload secret from key file using `--file` so line breaks are preserved.

### PostgreSQL config path error in Ansible DB role

If you see missing path errors like `/etc/postgresql/16/main/postgresql.conf`, use the current role in this repo.
It discovers `postgresql.conf` and `pg_hba.conf` dynamically under `/etc/postgresql`.

### Ansible `become_user: postgres` chmod ACL error

If you see `chmod: invalid mode: 'A+user:postgres:rx:allow'`, avoid `become_user: postgres` in that environment.
This repo uses `sudo -u postgres psql ...` commands in the DB role to avoid that issue.

### `terraform validate` provider/plugin error locally

If you see provider schema/plugin startup errors, remove local plugin cache and re-init:

```bash
cd terraform
rm -rf .terraform .terraform.lock.hcl
terraform init
terraform validate
```

## Security Notes

- Do not keep real passwords in tracked files.
- Prefer SSH key auth and keep private keys only in secure stores (Key Vault / GitHub secrets context).
- Restrict `ssh_source_cidr` to your IP (`/32`) instead of `0.0.0.0/0`.
- Rotate any private key that has been exposed in terminal logs/screenshots.

## Future Improvements

- Add separate NSGs for app/db tiers and restrict east-west ports explicitly.
- Use remote Terraform backend (Azure Storage) with state locking.
- Split CI into `plan` on PR and manual `apply` on main.
