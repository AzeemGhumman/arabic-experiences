#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
source "$ROOT/deploy/config.env"
AWS_PROFILE="${AWS_PROFILE:-personal}"

ACCOUNT_ID="$(aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)"
OIDC_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
ROLE_NAME="github-actions-arabic-experiences"
GITHUB_REPO="AzeemGhumman/arabic-experiences"

echo "Using AWS account $ACCOUNT_ID (profile: $AWS_PROFILE)"

if aws iam get-open-id-connect-provider --profile "$AWS_PROFILE" --open-id-connect-provider-arn "$OIDC_ARN" >/dev/null 2>&1; then
  echo "GitHub OIDC provider already exists"
else
  echo "Creating GitHub OIDC provider"
  aws iam create-open-id-connect-provider \
    --profile "$AWS_PROFILE" \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 1c58a3a8518e8759bf075b76b750d4f2df264fcd
fi

TRUST="$(mktemp)"
POLICY="$(mktemp)"
cat >"$TRUST" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "$OIDC_ARN" },
    "Action": ["sts:AssumeRoleWithWebIdentity", "sts:TagSession"],
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": [
          "repo:${GITHUB_REPO}:*",
          "repo:azeemghumman/arabic-experiences:*"
        ]
      }
    }
  }]
}
EOF

cat >"$POLICY" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SyncSiteBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::${BUCKET}"
    },
    {
      "Sid": "WriteSiteObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::${BUCKET}/*"
    },
    {
      "Sid": "InvalidateCloudFront",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:GetDistribution"
      ],
      "Resource": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${CLOUDFRONT_DISTRIBUTION_ID}"
    }
  ]
}
EOF

if aws iam get-role --profile "$AWS_PROFILE" --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  echo "Updating role $ROLE_NAME"
  aws iam update-assume-role-policy --profile "$AWS_PROFILE" --role-name "$ROLE_NAME" --policy-document "file://$TRUST"
else
  echo "Creating role $ROLE_NAME"
  aws iam create-role \
    --profile "$AWS_PROFILE" \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document "file://$TRUST" \
    --description "GitHub Actions deploy for arabic.azeemghumman.com"
fi

aws iam put-role-policy \
  --profile "$AWS_PROFILE" \
  --role-name "$ROLE_NAME" \
  --policy-name arabic-experiences-deploy \
  --policy-document "file://$POLICY"

rm -f "$TRUST" "$POLICY"

echo "OIDC role ready: arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
echo "Pushes to main on $GITHUB_REPO can now deploy via GitHub Actions."
