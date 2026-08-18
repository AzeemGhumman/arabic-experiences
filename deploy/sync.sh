#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/deploy/config.env"

if [[ -z "${CI:-}" ]]; then
  AWS_PROFILE="${AWS_PROFILE:-personal}"
else
  AWS_PROFILE=""
fi

if [[ -z "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  echo "CLOUDFRONT_DISTRIBUTION_ID is not set. Run ./deploy/setup-infra.sh first." >&2
  exit 1
fi

aws_cmd() {
  if [[ -n "${AWS_PROFILE:-}" && -z "${CI:-}" ]]; then
    aws --profile "$AWS_PROFILE" --region "$AWS_REGION" "$@"
  else
    aws --region "$AWS_REGION" "$@"
  fi
}

if [[ "${SKIP_BUILD:-}" != "1" ]]; then
  echo "Building app..."
  npm run build --prefix "$ROOT"
fi

echo "Syncing dist/ -> s3://$BUCKET"
aws_cmd s3 sync "$ROOT/dist/" "s3://$BUCKET/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html" \
  --exclude "*.html"

aws_cmd s3 cp "$ROOT/dist/index.html" "s3://$BUCKET/index.html" \
  --cache-control "public,max-age=0,must-revalidate" \
  --content-type "text/html"

shopt -s nullglob
for html in "$ROOT"/dist/*.html; do
  base="$(basename "$html")"
  [[ "$base" == "index.html" ]] && continue
  aws_cmd s3 cp "$html" "s3://$BUCKET/$base" \
    --cache-control "public,max-age=0,must-revalidate" \
    --content-type "text/html"
done

echo "Invalidating CloudFront cache..."
INVALIDATION_ID="$(aws_cmd cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' --output text)"

echo "Waiting for invalidation $INVALIDATION_ID..."
aws_cmd cloudfront wait invalidation-completed \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --id "$INVALIDATION_ID"

echo "Live at https://$DOMAIN"
