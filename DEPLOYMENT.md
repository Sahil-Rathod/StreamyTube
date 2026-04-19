# Google Cloud Run Deployment Guide

This guide will help you deploy your video streaming application on Google Cloud Run for free.

## Prerequisites

1. **Google Cloud Account** - Create a free account at [https://cloud.google.com](https://console.cloud.google.com/)
2. **Google Cloud CLI** - Install from [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3. **Docker** - Install from [https://www.docker.com/products/docker-desktop](https://www.docker.com/)

## Setup Steps

### 1. Initialize Google Cloud Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"

# Create a new project
gcloud projects create $PROJECT_ID

# Set as default project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud auth configure-docker
```

### 3. Deploy Backend (Spring Boot)

```bash
cd backend

# Configure API Key
export PEXELS_API_KEY="your-pexels-api-key"

# Build and push Docker image
docker build -t gcr.io/$PROJECT_ID/video-backend:latest .
docker push gcr.io/$PROJECT_ID/video-backend:latest

# Deploy to Cloud Run
gcloud run deploy video-backend \
  --image gcr.io/$PROJECT_ID/video-backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars PEXELS_API_KEY=$PEXELS_API_KEY \
  --memory 512Mi \
  --timeout 300 \
  --max-instances 10

# Save the backend URL
export BACKEND_URL=$(gcloud run services describe video-backend --region $REGION --format 'value(status.url)')
echo "Backend URL: $BACKEND_URL"
```

### 4. Deploy Frontend (Angular)

Before deploying, update your Angular environment file to use your backend URL:

Edit [src/app/services/video.service.ts](src/app/services/video.service.ts) and update the API endpoint to use your Cloud Run backend URL.

```bash
cd ../frontend

# Build and push Docker image
docker build -t gcr.io/$PROJECT_ID/video-frontend:latest .
docker push gcr.io/$PROJECT_ID/video-frontend:latest

# Deploy to Cloud Run
gcloud run deploy video-frontend \
  --image gcr.io/$PROJECT_ID/video-frontend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 256Mi \
  --timeout 60 \
  --max-instances 10

# Get the frontend URL
gcloud run services describe video-frontend --region $REGION --format 'value(status.url)'
```

## Free Tier Limits

- **Cloud Run**: 2 million requests/month free
- **Container Registry**: 500 MB storage free
- **Artifact Registry**: Free tier available
- Each service stops after 15 minutes of inactivity (great for saving costs!)

## Cost Optimization Tips

1. **Use `--max-instances 10`** - Prevents runaway costs
2. **Set memory appropriately** - Backend: 512Mi, Frontend: 256Mi
3. **Use managed service** - Auto-scales to 0 when idle
4. **Monitor usage** - Check Cloud Run dashboard regularly

## Updating Your Deployment

To update a service after code changes:

```bash
# For backend
cd backend
docker build -t gcr.io/$PROJECT_ID/video-backend:latest .
docker push gcr.io/$PROJECT_ID/video-backend:latest
gcloud run deploy video-backend --image gcr.io/$PROJECT_ID/video-backend:latest

# For frontend
cd ../frontend
docker build -t gcr.io/$PROJECT_ID/video-frontend:latest .
docker push gcr.io/$PROJECT_ID/video-frontend:latest
gcloud run deploy video-frontend --image gcr.io/$PROJECT_ID/video-frontend:latest
```

## Configure CORS (if needed)

If frontend and backend are different origins, update [backend/src/main/java/com/videostreaming/backend/config/WebConfig.java](backend/src/main/java/com/videostreaming/backend/config/WebConfig.java) to allow your frontend URL.

## Monitoring

View logs and monitor your services:

```bash
# View backend logs
gcloud run logs read video-backend --region $REGION --limit 50

# View frontend logs
gcloud run logs read video-frontend --region $REGION --limit 50

# View metrics in Cloud Console
# https://console.cloud.google.com/run
```

## Troubleshooting

**Service not responding**
- Check logs with `gcloud run logs read`
- Ensure environment variables are set correctly

**CORS errors**
- Verify backend CORS configuration
- Update backend service to allow frontend domain

**Build fails**
- Check Docker image builds locally: `docker build .`
- Verify all dependencies are properly installed

## Clean Up (to avoid future charges)

```bash
# Delete services
gcloud run services delete video-backend --region $REGION
gcloud run services delete video-frontend --region $REGION
```

## Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Container Registry Pricing](https://cloud.google.com/container-registry/pricing)
