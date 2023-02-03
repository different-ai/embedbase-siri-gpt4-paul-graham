# Crawlee + PlaywrightCrawler + TypeScript project

WIP!!!

```bash
npm i
npm start
```

## Stack

- [Crawlee + Playwright crawler](https://crawlee.dev/docs/examples/playwright-crawler)

## Deploy

## Cloud Run deployment

### Setup

```bash
# login to gcloud
gcloud auth login

PROJECT_ID=$(gcloud config get-value project)

# Enable container registry
gcloud services enable containerregistry.googleapis.com

# Enable Cloud Run
gcloud services enable run.googleapis.com

# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# create a secret for the config
gcloud secrets create EMBEDBASE_PAUL_GRAHAM --replication-policy=automatic

# add a secret version based on your yaml config
gcloud secrets versions add EMBEDBASE_PAUL_GRAHAM --data-file=config.yaml

IMAGE_URL="gcr.io/${PROJECT_ID}/embedbase-paul-graham:0.0.1"

docker buildx build . --platform linux/amd64 -t ${IMAGE_URL} -f ./search/Dockerfile

docker push ${IMAGE_URL}

gcloud run deploy embedbase-paul-graham \
  --image ${IMAGE_URL} \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets /secrets/config.yaml=EMBEDBASE_PAUL_GRAHAM:1
```

