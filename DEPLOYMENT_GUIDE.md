# Deployment Guide - Shorts Generator

Complete guide for deploying the TikTok/Instagram Shorts Generator to Vercel/Render.

## Architecture

- **Frontend**: Next.js app (Vercel)
- **Backend/Workflow**: n8n instance (Render)
- **Database**: Google Sheets (free)
- **APIs**: OpenRouter (free tier), Vizard AI, Social Media APIs

## Prerequisites

1. GitHub account
2. Vercel account (free tier)
3. Render account (free tier)
4. n8n account or self-hosted instance
5. Social media API credentials (see FREE_SERVICES_GUIDE.md)

## Step 1: Deploy Frontend to Vercel

### Option A: Deploy from GitHub

1. **Push to GitHub**:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/shorts-generator-frontend.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable:
     - Key: `N8N_WEBHOOK_URL`
     - Value: `https://your-n8n-instance.onrender.com/webhook/frontend-trigger-id`
   - Deploy!

### Option B: Deploy via Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel
# Follow prompts
# Add environment variable when prompted
```

### Environment Variables for Frontend

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.onrender.com/webhook/frontend-trigger-id
```

## Step 2: Deploy n8n to Render

### Option A: Docker on Render

1. **Create Dockerfile** (if not exists):
   ```dockerfile
   FROM n8nio/n8n:latest
   ENV N8N_HOST=0.0.0.0
   ENV N8N_PORT=5678
   ENV N8N_PROTOCOL=https
   ENV WEBHOOK_URL=https://your-n8n-instance.onrender.com/
   ```

2. **Create render.yaml**:
   ```yaml
   services:
     - type: web
       name: n8n
       env: docker
       plan: free
       dockerfilePath: ./Dockerfile
       envVars:
         - key: N8N_HOST
           value: 0.0.0.0
         - key: N8N_PORT
           value: 5678
         - key: N8N_PROTOCOL
           value: https
         - key: WEBHOOK_URL
           value: https://your-n8n-instance.onrender.com/
         - key: VIZARD_API_KEY
           fromService:
             type: secret
             name: vizard-api-key
         - key: OPENROUTER_API_KEY
           fromService:
             type: secret
             name: openrouter-api-key
         - key: TIKTOK_ACCESS_TOKEN
           fromService:
             type: secret
             name: tiktok-access-token
         - key: INSTAGRAM_ACCESS_TOKEN
           fromService:
             type: secret
             name: instagram-access-token
         - key: INSTAGRAM_BUSINESS_ACCOUNT_ID
           fromService:
             type: secret
             name: instagram-business-account-id
         - key: YOUTUBE_ACCESS_TOKEN
           fromService:
             type: secret
             name: youtube-access-token
         - key: FACEBOOK_ACCESS_TOKEN
           fromService:
             type: secret
             name: facebook-access-token
         - key: FACEBOOK_PAGE_ID
           fromService:
             type: secret
             name: facebook-page-id
         - key: GOOGLE_SHEET_ID
           value: your-google-sheet-id
   ```

3. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository (if using Dockerfile)
   - Or use "Public Git repository" option
   - Set build command: `docker build -t n8n .`
   - Set start command: `docker run -p 5678:5678 n8n`
   - Add all environment variables from render.yaml
   - Deploy!

### Option B: n8n Cloud (Easier)

1. Sign up at [n8n.cloud](https://n8n.cloud) (free tier available)
2. Import your workflow JSON
3. Configure environment variables in n8n dashboard
4. Get webhook URL from n8n
5. Update frontend `N8N_WEBHOOK_URL` environment variable

## Step 3: Configure Environment Variables

### n8n Environment Variables

Add these in your n8n instance (Render or Cloud):

```env
# Vizard AI
VIZARD_API_KEY=your_vizard_api_key

# OpenRouter (FREE)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
WEBHOOK_URL=https://your-n8n-instance.onrender.com

# TikTok API
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

# Instagram API
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id

# YouTube API
YOUTUBE_ACCESS_TOKEN=your_youtube_access_token

# Facebook API
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
FACEBOOK_PAGE_ID=your_facebook_page_id

# Google Sheets
GOOGLE_SHEET_ID=your_google_sheet_id
```

## Step 4: Import Workflow to n8n

1. Open your n8n instance
2. Click "Workflows" → "Import from File"
3. Upload `enhanced-workflow.json`
4. Configure all credentials:
   - Google Sheets OAuth2
   - Social Media OAuth tokens
5. Activate the workflow
6. Note the webhook URL for frontend trigger

## Step 5: Test Deployment

### Test Frontend

1. Visit your Vercel URL
2. Enter a YouTube video URL
3. Click "Generate & Upload"
4. Check n8n workflow execution

### Test Webhook

```bash
curl -X POST https://your-vercel-url.vercel.app/api/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
    "language": "en"
  }'
```

## Step 6: Configure Social Media APIs

See `FREE_SERVICES_GUIDE.md` for detailed setup instructions for:
- TikTok API (free tier)
- Instagram Graph API (free)
- YouTube Data API v3 (free)
- Facebook Graph API (free)

## Troubleshooting

### Frontend Issues

- **CORS errors**: Add n8n URL to Vercel environment variables
- **Webhook not found**: Check `N8N_WEBHOOK_URL` is correct
- **Build fails**: Check Node.js version (should be 18+)

### n8n Issues

- **Workflow not executing**: Check workflow is active
- **Webhook not receiving**: Check Render URL is accessible
- **API errors**: Verify all API keys are set correctly
- **Timeout**: Render free tier has 90s timeout limit

### Render Issues

- **Service crashes**: Check logs for errors
- **Memory issues**: Upgrade to paid plan or optimize workflow
- **Webhook not accessible**: Ensure service is running and URL is correct

## Monitoring

### Vercel Analytics

- Visit Vercel dashboard
- Check "Analytics" tab for frontend metrics
- Monitor error rates

### n8n Execution Logs

- Visit n8n dashboard
- Check "Executions" tab
- Review failed executions
- Set up error notifications

### Render Logs

- Visit Render dashboard
- Click on your service
- Check "Logs" tab for runtime errors

## Cost Optimization

### Free Tier Limits

- **Vercel**: Unlimited requests (hobby plan)
- **Render**: 750 hours/month free
- **OpenRouter**: $5 free credits/month
- **Social Media APIs**: Free tier available

### Optimization Tips

1. Use free tier models on OpenRouter (gpt-4o-mini)
2. Batch process videos (don't run too many simultaneously)
3. Monitor Render hours usage
4. Use scheduled workflows to avoid 24/7 running

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] n8n deployed to Render or Cloud
- [ ] All environment variables configured
- [ ] Workflow imported and activated
- [ ] Social media APIs configured
- [ ] Google Sheets connected
- [ ] Webhook URL tested
- [ ] Frontend-webhook integration tested
- [ ] Error monitoring set up
- [ ] Documentation updated with production URLs

## Support

For issues:
1. Check n8n execution logs
2. Check Render service logs
3. Check Vercel build logs
4. Review API documentation
5. Check FREE_SERVICES_GUIDE.md for API setup

