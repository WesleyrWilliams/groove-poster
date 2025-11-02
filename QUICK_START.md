# Quick Start Guide

Get your Shorts Generator up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- API keys ready (see below)

## Step 1: Setup Backend

1. **Navigate to backend**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file**:
```bash
cp .env.example .env
```

4. **Edit `.env` with minimal required keys**:
```env
VIZARD_API_KEY=your_vizard_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=3001
```

5. **Start backend**:
```bash
npm run dev
```

Backend will run on `http://localhost:3001`

## Step 2: Setup Frontend

1. **Open new terminal, navigate to frontend**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env.local` file**:
```env
BACKEND_URL=http://localhost:3001
```

4. **Start frontend**:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 3: Preview Frontend

1. **Open browser**:
   - Go to `http://localhost:3000`
   - You should see the Shorts Generator interface

2. **Test the interface**:
   - Enter a YouTube video URL
   - Click "Generate & Upload to All Platforms"
   - You should see a status message

## Required API Keys (Minimum)

### Vizard AI (Required)
- Sign up at Vizard AI
- Get your API key
- Add to `.env` as `VIZARD_API_KEY`

### OpenRouter (Required - FREE)
- Sign up at [openrouter.ai](https://openrouter.ai)
- Get free API key ($5 free credits/month)
- Add to `.env` as `OPENROUTER_API_KEY`

## Optional API Keys

### Social Media APIs (Optional)
- TikTok API (if you want TikTok uploads)
- Instagram Graph API (if you want Instagram uploads)
- YouTube Data API (if you want YouTube uploads)
- Facebook Graph API (if you want Facebook uploads)

### Google Sheets (Optional)
- Create Google Service Account
- Download credentials JSON
- Add to `.env` as `GOOGLE_CREDENTIALS` (JSON string)
- Add `GOOGLE_SHEET_ID`

## Testing

### Test Backend
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","message":"Shorts Generator API is running"}
```

### Test Video Processing
```bash
curl -X POST http://localhost:3001/api/process-video \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID", "language": "en"}'
```

### Test Frontend
1. Open `http://localhost:3000`
2. Enter a YouTube video URL
3. Click "Generate & Upload"
4. Check backend logs for processing

## Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be 18+)
- Check if port 3001 is already in use
- Verify `.env` file exists and has required keys

### Frontend won't connect
- Make sure backend is running on port 3001
- Check `.env.local` has correct `BACKEND_URL`
- Check browser console for errors

### API errors
- Verify API keys are correct
- Check backend logs for detailed error messages
- Ensure Vizard API key has proper permissions

## Next Steps

1. **Add Social Media APIs** (see `FREE_SERVICES_GUIDE.md`)
2. **Configure Google Sheets** (optional)
3. **Deploy to Vercel/Render** (see `DEPLOYMENT_GUIDE.md`)

## Support

- Check backend logs: `npm run dev` in backend folder
- Check frontend console: Browser DevTools (F12)
- Review API documentation for each service

