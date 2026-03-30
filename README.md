# India Crime Heatmap 🗺️

Interactive choropleth visualization of crime data across Indian states/UTs using NCRB "Crime in India" 2022 reports.

**Live:** [crimemap.amanops.dev](https://crimemap.amanops.dev)

## Stack
- **Frontend:** React + Vite
- **Container:** Nginx Alpine (multi-stage build)
- **Infra:** K3s → Traefik → Cloudflare Tunnel
- **CI/CD:** GitHub Actions → GHCR → ArgoCD (GitOps)

## Architecture

```
GitHub Push → GH Actions (build arm64 image) → GHCR
                                                  ↓
GitOps repo (gitops-pi5) → ArgoCD → K3s (Pi 5) → Traefik → Cloudflare Tunnel → crimemap.amanops.dev
```

## Local Dev

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy

See deployment steps in the project wiki or follow the GitOps flow:
1. Push code → GH Actions builds & pushes arm64 image to GHCR
2. Copy `k8s/` manifests to `gitops-pi5/apps/crime-map/`
3. Apply ArgoCD Application → auto-sync handles the rest
4. Add `crimemap.amanops.dev` to Cloudflare Tunnel config

## Data Source
Representative data based on NCRB "Crime in India" 2022. For exact figures, see [ncrb.gov.in](https://ncrb.gov.in).
