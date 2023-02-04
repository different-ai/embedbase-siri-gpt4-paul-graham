# embedbase-paul-graham

[Don’t want to handle infra? We’re launching a hosted version soon. Just click here to be first to know when it comes out](https://embedbase.anotherai.co).

This is an example of how to use [Embedbase](https://github.com/another-ai/embedbase) to build a search engine for [Paul Graham's essays](http://www.paulgraham.com/articles.html).
There are examples of querying the index using [terminal](linkhere) or [Apple Siri Shortcuts](linkhere).

## Demo

If you just want to try the end result, you can use the sandboxed version of the index here: [https://embedbase-paul-graham-c6txy76x2q-uc.a.run.app](https://embedbase-paul-graham-c6txy76x2q-uc.a.run.app) with Apple Siri Shortcuts:

https://www.youtube.com/shorts/9700RsFxMBc

Or in the terminal:

```bash
git clone https://github.com/another-ai/embedbase-paul-graham
cd embedbase-paul-graham
npm i
npm run playground https://embedbase-paul-graham-c6txy76x2q-uc.a.run.app
```

## Quickstart


```bash
git clone https://github.com/another-ai/embedbase
cd embedbase
```

```yaml
# embedbase/config.yaml
# https://app.pinecone.io/
pinecone_index: "my index name"
# replace this with your environment
pinecone_environment: "us-east1-gcp"
pinecone_api_key: ""

# https://platform.openai.com/account/api-keys
openai_api_key: "sk-xxxxxxx"
# https://platform.openai.com/account/org-settings
openai_organization: "org-xxxxx"
```

```bash
docker-compose up
```

In another terminal:

```bash
git clone https://github.com/another-ai/embedbase-paul-graham
cd embedbase-paul-graham
npm i
npm start
```

## Stack

- [Embedbase](https://github.com/another-ai/embedbase)
- Typescript
- [Crawlee + Playwright crawler](https://crawlee.dev/docs/examples/playwright-crawler)
- [Google Cloud Run](https://cloud.google.com/run) for deployment
- [Apple Siri Shortcuts](linkhere.) for querying the index

## Deploy

## Cloud Run deployment

[Don’t want to handle infra? We’re launching a hosted version soon. Just click here to be first to know when it comes out](https://embedbase.anotherai.co).

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

# getting cloud run url
gcloud run services list --platform managed --region us-central1 --format="value(status.url)" --filter="metadata.name=embedbase-paul-graham"
```


