# Architecture - Azure 3-Tier Medusa Deployment

## Overview

This project deploys a 3-tier application on Azure using Terraform:
- `web` tier (`vm1-public`): entry point/jump host
- `app` tier (`vm2-private`): Medusa backend service
- `db` tier (`vm3-private`): PostgreSQL database

## Network Topology

- Resource Group: `rg-3vm-vnet-lab`
- Region: `Central India`
- VNet: `10.0.0.0/16`
- Subnets:
  - `subnet1` (`10.0.1.0/24`) -> `vm1-public` + Public IP
  - `subnet2` (`10.0.2.0/24`) -> `vm2-private`
  - `subnet3` (`10.0.3.0/24`) -> `vm3-private`

## Security Model

- `vm1-public` has a Standard Public IP and NSG allowing inbound `TCP/22` from `ssh_source_cidr`.
- `vm2-private` and `vm3-private` have no public IP.
- Access to private VMs is through `vm1-public` using SSH jump (`ProxyJump`).
- App-to-DB traffic uses private networking (app subnet to DB subnet).

## Component Responsibilities

- `vm1-public` (Web/Jump):
  - Hosts Next.js frontend (optional runtime path)
  - Acts as SSH bastion for private VMs
- `vm2-private` (App):
  - Runs Medusa backend on port `9000`
  - Connects to PostgreSQL on `vm3-private`
- `vm3-private` (DB):
  - Runs PostgreSQL
  - Stores Medusa data

## Deployment Flow

1. Terraform provisions RG, VNet, subnets, NICs, NSG, public IP, and 3 VMs.
2. Terraform outputs VM public/private IPs and generated Ansible inventory.
3. Ansible (or shell scripts) configures DB, app, and web services.
4. GitHub Actions workflow can automate init/validate/plan/apply/destroy with Azure OIDC.

## Data Flow

1. User reaches frontend on `vm1-public`.
2. Frontend calls Medusa backend on `vm2-private:9000`.
3. Backend reads/writes data to PostgreSQL on `vm3-private:5432`.

## Diagram (Mermaid)

```mermaid
flowchart LR
  U[User / Admin]

  subgraph AZ[Azure Subscription]
    subgraph RG[Resource Group: rg-3vm-vnet-lab]
      subgraph VNET[VNet: 10.0.0.0/16]
        subgraph S1[subnet1: 10.0.1.0/24]
          VM1[vm1-public\nWeb + Jump Host]
        end
        subgraph S2[subnet2: 10.0.2.0/24]
          VM2[vm2-private\nMedusa Backend :9000]
        end
        subgraph S3[subnet3: 10.0.3.0/24]
          VM3[vm3-private\nPostgreSQL :5432]
        end
      end
      PIP[Public IP\n(Standard SKU)]
      NSG[NSG on vm1 NIC\nAllow TCP/22 from ssh_source_cidr]
    end
  end

  U -->|SSH 22| PIP --> VM1
  NSG --> VM1
  VM1 -->|ProxyJump SSH| VM2
  VM1 -->|ProxyJump SSH| VM3
  VM1 -->|HTTP/HTTPS| VM2
  VM2 -->|PostgreSQL 5432| VM3
```

## Notes

- VM size default is `Standard_DC1s_v3` and uses Ubuntu Gen2 image (`22_04-lts-gen2`).
- For production hardening, restrict SSH CIDR to your IP (`/32`) and move to key-based auth.
