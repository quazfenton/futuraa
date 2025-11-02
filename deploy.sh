#!/bin/bash

# Script to build and push Docker image to Google Container Registry

# Variables - Update these with your values
PROJECT_ID="your-project-id"
IMAGE_NAME="futuraa-app"
TAG="latest"

# Authenticate with Google Cloud
echo "Authenticating with Google Cloud..."
gcloud auth configure-docker

# Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME:$TAG .

# Tag the image for Google Container Registry
echo "Tagging image for Google Container Registry..."
docker tag $IMAGE_NAME:$TAG gcr.io/$PROJECT_ID/$IMAGE_NAME:$TAG

# Push the image to Google Container Registry
echo "Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:$TAG

echo "Image successfully pushed to gcr.io/$PROJECT_ID/$IMAGE_NAME:$TAG"
echo "You can now deploy this image to Google Cloud Run, GKE, or GCE."