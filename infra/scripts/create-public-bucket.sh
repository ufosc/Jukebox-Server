#!/bin/bash

# Docs:
# Creating buckets: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
# cli create-bucket: https://docs.aws.amazon.com/cli/latest/reference/s3api/create-bucket.html
# cli public access block: https://docs.aws.amazon.com/cli/latest/reference/s3api/put-public-access-block.html
# cli bucket acls: https://docs.aws.amazon.com/cli/latest/reference/s3api/put-bucket-acl.html
# cli bucket website: https://docs.aws.amazon.com/cli/latest/reference/s3api/put-bucket-website.html

# Context: infra/

set -e

BUCKET_PREFIX="jukebox-client"
REGION="us-east-1"

# Create bucket with unique name
export bucket_name="$BUCKET_PREFIX-$(uuidgen | tr -d - | tr '[:upper:]' '[:lower:]' )"
aws s3api create-bucket \
  --bucket "$bucket_name" \
  --region "$REGION" \
  --object-ownership BucketOwnerPreferred > /dev/null

# Disable default security protocols, allow public access
aws s3api put-public-access-block \
  --bucket "$bucket_name" \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" > /dev/null


# Create policy so public can only read bucket content
aws s3api put-bucket-policy \
  --bucket "$bucket_name" \
  --policy "$(envsubst < ./templates/s3/s3-allow-public-access-policy.json.tpl)" > /dev/null
  
# Create s3 static website hosting
aws s3api put-bucket-website \
  --bucket "$bucket_name" \
  --website-configuration '{ "IndexDocument": { "Suffix": "index.html" } }' > /dev/null
  
bucket_uri="$bucket_name.s3-website-$REGION.amazonaws.com"
echo "Bucket upload uri: s3://$bucket_name"
echo "Bucket proxy uri: $bucket_uri"
echo "Bucket endpoint: http://$bucket_uri"
  
