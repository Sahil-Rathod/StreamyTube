# Deploy to Render + Vercel (Free & Easy)

Deploy your video streaming app completely free on Render (backend) + Vercel (frontend).

## Why Render + Vercel?

✅ **No billing required**  
✅ **Auto-deploys from GitHub**  
✅ **Free tier very generous**  
✅ **5 minutes to deploy**

---

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click **Sign up**
3. Select **Sign up with GitHub**
4. Authorize & verify email

### Step 2: Create Web Service
1. On dashboard, click **New +** → **Web Service**
2. Select your GitHub repository
3. Configure:

| Field | Value |
|-------|-------|
| Name | `video-backend` |
| Environment | `Docker` |
| Plan | `Free` |

4. Click **Create Web Service**

### Step 3: Configure Environment
Once created, go to **Settings**:

1. Find **Environment** section
2. Add these variables:

| Key | Value |
|-----|-------|
| `PEXELS_API_KEY` | `6PajgCRIIxWDvZ9YjW4kKiAG3dMGUYJs4TEJufJiPGd332pTbQ89dmP4` |
| `PORT` | `8080` |

3. Click **Save**

### Step 4: Deploy
1. Click **Manual Deploy** → **Deploy latest commit**
2. Wait 5-10 minutes for build (first time takes longer)
3. Once done, you'll see the URL: `https://video-backend-xxxxx.onrender.com`

**Note:** Free tier sleeps after 15 min inactivity. Wakes up on first request (takes 30 sec).

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up**
3. Select **Sign up with GitHub**
4. Authorize

### Step 2: Import Your Project
1. Click **Add New...** → **Project**
2. Select your GitHub repository
3. Configure:

| Field | Value |
|-------|-------|
| Framework | `Angular` |
| Root Directory | `frontend` |

4. Click **Deploy**

### Step 3: Set Environment Variables
After deploy starts, go to **Settings**:

1. Click **Environment Variables**
2. Add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Your Render backend URL |

Example: `https://video-backend-xxxxx.onrender.com`

3. Click **Save**
4. Re-deploy (click **Redeploy** button)

### Step 4: Test
1. Once deployed, click the URL to open frontend
2. Should load your video streaming app
3. Videos will load from your backend

---

## Update Frontend API Endpoint

You already have environment setup. Make sure:

File: [frontend/src/environments/environment.ts](frontend/src/environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

File: [frontend/src/environments/environment.prod.ts](frontend/src/environments/environment.prod.ts)  
```typescript
export const environment = {
  production: true,
  apiUrl: '' // Uses current domain, or set to backend URL
};
```

---

## Your Live URLs

After both deploy:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://video-backend-xxxxx.onrender.com`

---

## Auto-Deploy on Push

Both platforms auto-deploy on GitHub push to `main`:

```bash
# Make changes
cd /Users/sahil/Projects
git add .
git commit -m "Your change"
git push origin main

# Automatically deploys! Check:
# - Render: https://dashboard.render.com
# - Vercel: https://vercel.com/dashboard
```

---

## Troubleshooting

**Frontend shows error connecting to backend?**
- Check Render backend is running (visit backend URL)
- Verify API endpoint in Vercel env vars

**Backend not building?**
- Check build logs in Render dashboard
- Verify `gradlew` is executable: `chmod +x backend/gradlew`

**Slow cold starts?**
- Render free tier sleeps → first request takes 30 sec (normal!)
- Vercel is instant

**Can't connect to GitHub?**
- Revoke access in GitHub Settings → Applications
- Reconnect Render & Vercel accounts

---

## Free Tier Limits

### Render (Backend)
- 750 hours/month (always on)
- Auto-sleeps after 15 min inactivity
- Can run indefinitely within 750 hours/month

### Vercel (Frontend)  
- Unlimited deployments
- 100GB bandwidth/month per team
- Served from global CDN (fast!)

**Both free plans are perfect for testing!**

---

## Future Upgrades

When ready for production:
- **Render**: Pay-as-you-go ($5-20/month)
- **Vercel**: Pay-as-you-go (usually free for most projects)

---

## Quick Checklist ✅

- [ ] Repository pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Vercel account created  
- [ ] Frontend deployed to Vercel
- [ ] API endpoint configured
- [ ] Frontend URL loads and works

You're done! 🚀
