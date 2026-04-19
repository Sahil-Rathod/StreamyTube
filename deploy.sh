#!/bin/bash

# Quick deployment script for Google Cloud Run

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Video Streaming App - Cloud Run Deployment ===${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get configuration
read -p "Enter your Google Cloud Project ID: " PROJECT_ID
read -p "Enter your Pexels API Key: " PEXELS_API_KEY
read -p "Enter deployment region (default: us-central1): " REGION
REGION=${REGION:-us-central1}

echo -e "\n${BLUE}Configuration:${NC}"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Set project
gcloud config set project $PROJECT_ID

# Enable APIs
echo -e "${BLUE}Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Configure Docker
echo -e "${BLUE}Configuring Docker authentication...${NC}"
gcloud auth configure-docker

# Deploy Backend
echo -e "\n${BLUE}Building and deploying backend...${NC}"
cd backend
docker build -t gcr.io/$PROJECT_ID/video-backend:latest .
docker push gcr.io/$PROJECT_ID/video-backend:latest

gcloud run deploy video-backend \
  --image gcr.io/$PROJECT_ID/video-backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars PEXELS_API_KEY=$PEXELS_API_KEY \
  --memory 512Mi \
  --timeout 300 \
  --max-instances 10

BACKEND_URL=$(gcloud run services describe video-backend --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Backend deployed: $BACKEND_URL${NC}"

# Deploy Frontend
echo -e "\n${BLUE}Building and deploying frontend...${NC}"
cd ../frontend
docker build -t gcr.io/$PROJECT_ID/video-frontend:latest .
docker push gcr.io/$PROJECT_ID/video-frontend:latest

gcloud run deploy video-frontend \
  --image gcr.io/$PROJECT_ID/video-frontend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 256Mi \
  --timeout 60 \
  --max-instances 10

FRONTEND_URL=$(gcloud run services describe video-frontend --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Frontend deployed: $FRONTEND_URL${NC}"

echo -e "\n${GREEN}=== Deployment Complete ===${NC}"
echo -e "Frontend: ${BLUE}$FRONTEND_URL${NC}"
echo -e "Backend: ${BLUE}$BACKEND_URL${NC}"
echo ""
echo "Note: Update the API endpoint in your frontend to use the backend URL above."
