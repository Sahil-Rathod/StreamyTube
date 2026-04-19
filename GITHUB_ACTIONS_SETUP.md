# Deploy with GitHub Actions (No Local Tools Needed!)

This setup automatically deploys your app to Google Cloud Run whenever you push code to GitHub.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `video-streaming-app`
3. Clone it locally:
   ```bash
   cd /Users/sahil/Projects
   git init
   git remote add origin https://github.com/YOUR_USERNAME/video-streaming-app.git
   git branch -M main
   ```

## Step 2: Push Code to GitHub

```bash
cd /Users/sahil/Projects
git add .
git commit -m "Initial commit: video streaming app"
git push -u origin main
```

## Step 3: Set Up Google Cloud Project

### 3a. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (free account available)
3. Enable these APIs:
   - Cloud Run API
   - Container Registry API
   - Artifact Registry API

### 3b. Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `github-actions`
4. Click **Create and Continue**
5. Grant these roles:
   - `Cloud Run Admin`
   - `Service Account User`
   - `Storage Admin`
6. Click **Continue** then **Done**

### 3c. Create Service Account Key
1. Click the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON**
5. A file will download - keep it safe!

## Step 4: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Name | Value |
|------|-------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID |
| `GCP_SA_KEY` | **Entire contents** of the JSON key file (past it as-is) |
| `PEXELS_API_KEY` | Your Pexels API key (already in app: `6PajgCRIIxWDvZ9YjW4kKiAG3dMGUYJs4TEJufJiPGd332pTbQ89dmP4`) |

> ⚠️ **Never commit these secrets** - they're only in GitHub Actions

## Step 5: Deploy!

Just push code:
```bash
git push origin main
```

That's it! GitHub Actions will:
1. Build Docker images
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Done!

## Check Deployment Status

1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the workflow run
4. Once complete, you'll see URLs in the logs

## View Your Live App

After deployment, you'll get URLs like:
- **Frontend**: `https://video-frontend-xxxxx.run.app`
- **Backend**: `https://video-backend-xxxxx.run.app`

## Make Changes & Auto-Deploy

Every time you push to main:
```bash
# Make changes
git add .
git commit -m "Your change description"
git push origin main

# Automatically deploys! Watch it in GitHub Actions tab
```

## Troubleshooting

**Deployment failed?** Check the workflow logs:
1. GitHub repo → **Actions** tab
2. Click the failed workflow
3. Expand failing step to see error

**Common issues:**
- `GCP_SA_KEY` not valid JSON → Copy entire downloaded file as-is
- Project ID mismatch → Verify in [Google Cloud Console](https://console.cloud.google.com)
- Service account lacks permissions → Add required roles

## Cost Management

- **Stay within free tier**: 2M requests/month, services auto-scale to 0 when idle
- **Monitor usage**: [Google Cloud Console](https://console.cloud.google.com/run) shows real-time stats
- **Set alerts**: Go to **Billing** → **Budgets & alerts**

## Delete Services (If Needed)

To avoid unexpected charges:
```bash
# In Google Cloud Console terminal:
gcloud run services delete video-backend --region us-central1
gcloud run services delete video-frontend --region us-central1
```
