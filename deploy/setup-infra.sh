#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/deploy/config.env"
AWS_PROFILE="${AWS_PROFILE:-personal}"
export AWS_REGION DOMAIN BUCKET CERT_ARN OAC_ID CACHE_POLICY_ID RESPONSE_HEADERS_POLICY_ID

STATE_FILE="$ROOT/deploy/.deploy-state.env"
ACCOUNT_ID="$(aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)"

echo "Using AWS account $ACCOUNT_ID (profile: $AWS_PROFILE)"

if aws s3api head-bucket --bucket "$BUCKET" --profile "$AWS_PROFILE" 2>/dev/null; then
  echo "Bucket s3://$BUCKET already exists"
else
  echo "Creating bucket s3://$BUCKET"
  aws s3api create-bucket --bucket "$BUCKET" --profile "$AWS_PROFILE" --region "$AWS_REGION"
fi

aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --profile "$AWS_PROFILE" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

CERT_ARN="$(aws acm list-certificates --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn | [0]" --output text)"

if [[ "$CERT_ARN" == "None" || -z "$CERT_ARN" ]]; then
  echo "Requesting ACM certificate for $DOMAIN"
  CERT_ARN="$(aws acm request-certificate \
    --domain-name "$DOMAIN" \
    --validation-method DNS \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" \
    --query CertificateArn --output text)"
else
  echo "Using existing certificate $CERT_ARN"
fi

CERT_STATUS="$(aws acm describe-certificate \
  --certificate-arn "$CERT_ARN" \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --query 'Certificate.Status' --output text)"

if [[ "$CERT_STATUS" != "ISSUED" ]]; then
  VALIDATION=""
  for _ in $(seq 1 20); do
    VALIDATION="$(aws acm describe-certificate \
      --certificate-arn "$CERT_ARN" \
      --profile "$AWS_PROFILE" \
      --region "$AWS_REGION" \
      --query 'Certificate.DomainValidationOptions[0].ResourceRecord' \
      --output json 2>/dev/null || true)"
    if [[ -n "$VALIDATION" && "$VALIDATION" != "null" ]]; then
      break
    fi
    sleep 3
  done

  if [[ -z "$VALIDATION" || "$VALIDATION" == "null" ]]; then
    echo "Could not fetch ACM DNS validation record. Try again in a minute." >&2
    exit 1
  fi

  RECORD_NAME="$(python3 -c "import json,sys; print(json.load(sys.stdin)['Name'])" <<<"$VALIDATION")"
  RECORD_VALUE="$(python3 -c "import json,sys; print(json.load(sys.stdin)['Value'])" <<<"$VALIDATION")"

  echo "Creating DNS validation record $RECORD_NAME"
  aws route53 change-resource-record-sets \
    --hosted-zone-id "$HOSTED_ZONE_ID" \
    --profile "$AWS_PROFILE" \
    --change-batch "$(cat <<EOF
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "$RECORD_NAME",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": [{ "Value": "$RECORD_VALUE" }]
    }
  }]
}
EOF
)"

  echo "Waiting for certificate validation (can take a few minutes)..."
  aws acm wait certificate-validated \
    --certificate-arn "$CERT_ARN" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION"
fi

DIST_ID=""
if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE"
  DIST_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
fi

if [[ -z "$DIST_ID" ]]; then
  DIST_ID="$(aws cloudfront list-distributions --profile "$AWS_PROFILE" --output json | python3 -c "
import json, sys
data = json.load(sys.stdin)
for item in data.get('DistributionList', {}).get('Items') or []:
    aliases = item.get('Aliases', {}).get('Items') or []
    if '$DOMAIN' in aliases:
        print(item['Id'])
        break
")"
fi

if [[ -z "$DIST_ID" ]]; then
  CALLER_REF="arabic-azeemghumman-$(date +%s)"
  CONFIG_FILE="$(mktemp)"
  export CALLER_REF
  python3 - "$CONFIG_FILE" <<'PY'
import json, os, sys

out = sys.argv[1]
domain = os.environ["DOMAIN"]
bucket = os.environ["BUCKET"]
cert = os.environ["CERT_ARN"]
oac = os.environ["OAC_ID"]
cache_policy = os.environ["CACHE_POLICY_ID"]
headers_policy = os.environ["RESPONSE_HEADERS_POLICY_ID"]
caller = os.environ["CALLER_REF"]

config = {
    "CallerReference": caller,
    "Comment": "Arabic experiences static site",
    "Enabled": True,
    "Aliases": {"Quantity": 1, "Items": [domain]},
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [{
            "Id": "arabic-s3",
            "DomainName": f"{bucket}.s3.{os.environ['AWS_REGION']}.amazonaws.com",
            "OriginPath": "",
            "S3OriginConfig": {"OriginAccessIdentity": ""},
            "OriginAccessControlId": oac,
        }],
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "arabic-s3",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"]},
        },
        "Compress": True,
        "CachePolicyId": cache_policy,
        "ResponseHeadersPolicyId": headers_policy,
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [{
            "ErrorCode": 403,
            "ResponsePagePath": "/index.html",
            "ResponseCode": "200",
            "ErrorCachingMinTTL": 0,
        }],
    },
    "ViewerCertificate": {
        "ACMCertificateArn": cert,
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021",
    },
    "HttpVersion": "http2",
    "PriceClass": "PriceClass_100",
}

with open(out, "w") as f:
    json.dump(config, f)
PY

  echo "Creating CloudFront distribution"
  DIST_ID="$(aws cloudfront create-distribution \
    --profile "$AWS_PROFILE" \
    --distribution-config "file://$CONFIG_FILE" \
    --query 'Distribution.Id' --output text)"
  rm -f "$CONFIG_FILE"
  echo "Created distribution $DIST_ID"
else
  echo "Using existing CloudFront distribution $DIST_ID"
fi

DIST_ARN="arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DIST_ID}"
CF_DOMAIN="$(aws cloudfront get-distribution --id "$DIST_ID" --profile "$AWS_PROFILE" --query 'Distribution.DomainName' --output text)"

echo "Updating bucket policy for CloudFront access"
POLICY="$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "cloudfront.amazonaws.com"},
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::${BUCKET}/*",
    "Condition": {"StringEquals": {"AWS:SourceArn": "${DIST_ARN}"}}
  }]
}
EOF
)"
aws s3api put-bucket-policy --bucket "$BUCKET" --profile "$AWS_PROFILE" --policy "$POLICY"

echo "Creating Route53 alias for $DOMAIN -> $CF_DOMAIN"
aws route53 change-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --profile "$AWS_PROFILE" \
  --change-batch "$(cat <<EOF
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "${DOMAIN}.",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": [{ "Value": "${CF_DOMAIN}" }]
    }
  }]
}
EOF
)"

cat >"$STATE_FILE" <<EOF
CLOUDFRONT_DISTRIBUTION_ID=$DIST_ID
CLOUDFRONT_DOMAIN=$CF_DOMAIN
CERT_ARN=$CERT_ARN
BUCKET=$BUCKET
DOMAIN=$DOMAIN
EOF

echo "Infrastructure ready."
echo "  Bucket: s3://$BUCKET"
echo "  CloudFront: $CF_DOMAIN ($DIST_ID)"
echo "  URL: https://$DOMAIN"
