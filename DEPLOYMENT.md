# Deployment Guide

## Overview

This guide covers deploying the frontend and backend to Vercel, with MongoDB Atlas as the database.

## Prerequisites

- GitHub/GitLab account
- Vercel account (free tier)
- MongoDB Atlas account (free tier)
- Groq API key (free)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email or Google
4. Verify your email

### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose "M0 Free" tier
3. Select a cloud provider (AWS recommended)
4. Choose a region (closest to your users)
5. Name your cluster (e.g., "cognitia-cluster")
6. Click "Create"
7. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `cognitia-user` (or your choice)
5. Click "Autogenerate Secure Password" and save it
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, restrict to Vercel IPs
4. Click "Confirm"

### Step 5: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials
7. Add database name: `mongodb+srv://...mongodb.net/cognitia?retryWrites=true&w=majority`
8. Save this connection string securely

---

## Part 2: Groq API Setup

### Step 1: Get Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create API Key"
5. Name it "Cognitia Project"
6. Copy the API key (starts with `gsk_...`)
7. Save it securely (you won't see it again)

---

## Part 3: Prepare Repository

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Full-stack AI assistant"

# Create GitHub repository (via GitHub website)
# Then add remote and push
git remote add origin https://github.com/yourusername/Cognitia_Round2_Task.git
git branch -M main
git push -u origin main
```

### Step 2: Verify Structure

Ensure your repository has this structure:
```
Cognitia_Round2_Task/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   ├── models/
│   └── package.json
└── README.md
```

---

## Part 4: Deploy Backend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Backend Project

1. Click "Add New..." → "Project"
2. Select your repository: `Cognitia_Round2_Task`
3. Click "Import"
4. **Important:** Configure root directory
   - Click "Edit" next to Root Directory
   - Enter: `backend`
   - This tells Vercel to deploy only the backend folder

### Step 3: Configure Backend Build Settings

**Framework Preset:** Other  
**Build Command:** `npm install`  
**Output Directory:** (leave empty)  
**Install Command:** `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `GROQ_API_KEY` | Your Groq API key (gsk_...) |
| `MONGODB_URI` | Your MongoDB connection string |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### Step 5: Deploy Backend

1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. Once complete, copy the deployment URL (e.g., `https://your-backend.vercel.app`)
4. Test the health endpoint: `https://your-backend.vercel.app/health`

### Step 6: Verify Backend

```bash
# Test health endpoint
curl https://your-backend.vercel.app/health

# Test chat endpoint
curl -X POST https://your-backend.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'
```

---

## Part 5: Deploy Frontend to Vercel

### Step 1: Import Frontend Project

1. Go to Vercel dashboard
2. Click "Add New..." → "Project"
3. Select the same repository: `Cognitia_Round2_Task`
4. Click "Import"
5. **Important:** Configure root directory
   - Click "Edit" next to Root Directory
   - Enter: `frontend`

### Step 2: Configure Frontend Build Settings

**Framework Preset:** Vite  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### Step 3: Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your backend URL (https://your-backend.vercel.app) |

**Important:** Don't include trailing slash in API URL.

### Step 4: Deploy Frontend

1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. Once complete, you'll get a URL (e.g., `https://your-frontend.vercel.app`)
4. Visit the URL to test your application

---

## Part 6: Update CORS Configuration

### Step 1: Update Backend CORS

In your backend code (`backend/src/server.js`):

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
```

### Step 2: Add FRONTEND_URL Environment Variable

1. Go to Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add new variable:
   - Name: `FRONTEND_URL`
   - Value: `https://your-frontend.vercel.app`
5. Click "Save"

### Step 3: Redeploy Backend

1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for redeployment

---

## Part 7: Testing Deployment

### Test Checklist

- [ ] Frontend loads without errors
- [ ] Theme toggle works
- [ ] Can submit a question
- [ ] Receives AI response
- [ ] Error handling works (try empty question)
- [ ] Rate limiting works (try 101 requests)
- [ ] Mobile responsive (if implemented)

### Test Questions

Try these to verify functionality:
1. "What is artificial intelligence?"
2. "Explain quantum computing"
3. "" (empty - should show error)
4. Very long question (1000+ chars - should show error)

---

## Part 8: Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to Vercel dashboard → Frontend project
2. Click "Settings" → "Domains"
3. Enter your domain (e.g., `cognitia-ai.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

### Add Custom Domain to Backend

1. Go to Vercel dashboard → Backend project
2. Click "Settings" → "Domains"
3. Enter your API subdomain (e.g., `api.cognitia-ai.com`)
4. Update frontend `VITE_API_URL` to new domain
5. Update backend `FRONTEND_URL` to new domain
6. Redeploy both projects

---

## Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Verify MongoDB connection string
- Check Network Access allows 0.0.0.0/0
- Verify database user credentials
- Check environment variables in Vercel

**Error: "Groq API key invalid"**
- Verify API key is correct
- Check for extra spaces in environment variable
- Regenerate API key if needed

**Error: "Module not found"**
- Verify `package.json` is in backend folder
- Check build command is `npm install`
- Redeploy with cleared cache

### Frontend Issues

**Error: "Failed to fetch"**
- Verify `VITE_API_URL` is correct
- Check backend is deployed and running
- Verify CORS is configured correctly
- Check browser console for errors

**Error: "Network Error"**
- Check backend URL is accessible
- Verify no trailing slash in API URL
- Check browser network tab for details

**Blank page after deployment**
- Check build output directory is `dist`
- Verify Vite config is correct
- Check browser console for errors

### CORS Issues

**Error: "CORS policy blocked"**
- Verify `FRONTEND_URL` in backend environment variables
- Check CORS origin matches frontend URL exactly
- Redeploy backend after CORS changes
- Clear browser cache

---

## Environment Variables Summary

### Backend (.env)
```env
GROQ_API_KEY=gsk_your_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cognitia
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Code tested locally
- [ ] Environment variables documented
- [ ] .env files in .gitignore
- [ ] README.md updated
- [ ] All dependencies in package.json
- [ ] Git repository pushed to GitHub

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained

### Groq API
- [ ] API key obtained
- [ ] API key tested locally

### Backend Deployment
- [ ] Vercel project created
- [ ] Root directory set to `backend`
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health endpoint tested
- [ ] Chat endpoint tested

### Frontend Deployment
- [ ] Vercel project created
- [ ] Root directory set to `frontend`
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Application loads
- [ ] Can submit questions

### Post-Deployment
- [ ] CORS configured
- [ ] Both deployments tested together
- [ ] Error handling verified
- [ ] Rate limiting tested
- [ ] Documentation updated with URLs

---

## Monitoring

### Vercel Dashboard

Monitor your deployments:
- **Analytics:** View traffic and performance
- **Logs:** Check runtime logs for errors
- **Deployments:** View deployment history

### MongoDB Atlas

Monitor your database:
- **Metrics:** View database operations
- **Performance:** Check query performance
- **Alerts:** Set up alerts for issues

---

## Updating Deployments

### Update Backend

```bash
# Make changes to backend code
git add backend/
git commit -m "Update: backend changes"
git push

# Vercel auto-deploys on push
```

### Update Frontend

```bash
# Make changes to frontend code
git add frontend/
git commit -m "Update: frontend changes"
git push

# Vercel auto-deploys on push
```

### Manual Redeploy

1. Go to Vercel dashboard
2. Select project
3. Go to Deployments
4. Click "..." on latest deployment
5. Click "Redeploy"

---

## Rollback

If deployment fails:

1. Go to Vercel dashboard
2. Select project
3. Go to Deployments
4. Find last working deployment
5. Click "..." → "Promote to Production"

---

## Cost Considerations

### Free Tier Limits

**Vercel:**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution time limits

**MongoDB Atlas:**
- 512 MB storage
- Shared RAM
- No backup/restore

**Groq:**
- Generous free tier
- Rate limits apply

### When to Upgrade

Consider paid plans when:
- Traffic exceeds free tier
- Need more database storage
- Require better performance
- Need advanced features

---

## Security Post-Deployment

- [ ] Change default passwords
- [ ] Rotate API keys regularly
- [ ] Monitor access logs
- [ ] Set up alerts for unusual activity
- [ ] Keep dependencies updated
- [ ] Review security headers

---

## Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Groq Docs:** [console.groq.com/docs](https://console.groq.com/docs)
- **Vercel Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
