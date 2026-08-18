# Deploy to arabic.azeemghumman.com

Same pattern as [chess.azeemghumman.com](https://chess.azeemghumman.com):

- **AWS profile:** `personal` (account `711609367175`)
- **S3 bucket:** `arabic-azeemghumman` (private)
- **CloudFront OAC:** `arabic-s3-oac` (this site only; not shared with chess)
- **CloudFront** with HTTPS cert and SPA fallback (`403 → /index.html`)
- **Route53** CNAME in `azeemghumman.com` hosted zone

## Automatic deploys

Pushes to `main` run [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

1. `npm ci` and `npm run build`
2. Assume `github-actions-arabic-experiences` via GitHub OIDC (no access keys)
3. Sync `dist/` to S3
4. Invalidate CloudFront and wait until the invalidation finishes

One-time IAM setup (already done for this repo):

```bash
./deploy/setup-github-oidc.sh
```

## Local / one-time infra

```bash
chmod +x deploy/*.sh
./deploy/setup-infra.sh   # bucket, cert, CloudFront, DNS
npm run deploy            # build, upload, invalidate
```

Local deploys use `--profile personal`. GitHub Actions leaves `AWS_PROFILE` empty and uses the OIDC role.
