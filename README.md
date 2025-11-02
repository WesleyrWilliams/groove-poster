# 🎉 GrooveSzn - AI Shorts Generator

A fully **FREE**, self-hosted AI-powered system that automatically creates and uploads viral short-form videos to TikTok, Instagram, YouTube Shorts, and Facebook.

## ✨ Features

- 🤖 **AI-Powered**: Uses OpenRouter (free tier) to find viral moments and generate captions
- 💰 **100% FREE**: Zero monthly costs using free APIs
- 🚀 **Self-Hosted**: Full control, no dependencies on paid services
- 📱 **Multi-Platform**: Automatically uploads to TikTok, Instagram, YouTube, Facebook
- 🎨 **Beautiful UI**: Modern Next.js frontend with real-time updates
- ⚡ **Fast**: Processes videos in seconds using free AI models

## 🏗️ Architecture

```
Frontend (Next.js) → Backend API (Express) → YouTube API → AI (OpenRouter) → Social Media APIs
                                         ↓
                                    $0/month
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (separate terminal)
cd frontend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```env
PORT=3001
YOUTUBE_API_KEY=your_youtube_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Create `frontend/.env.local`:
```env
BACKEND_URL=http://localhost:3001
```

### 3. Run Locally

```bash
# Backend
cd backend
npm run dev

# Frontend (separate terminal)
cd frontend
npm run dev
```

Visit: http://localhost:3000

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - Detailed setup guide
- [COMPLETE_PROGRESS.md](COMPLETE_PROGRESS.md) - Full feature breakdown
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Your app will be live at: `https://your-app.vercel.app`

## 🔒 Privacy & Terms

- Privacy: https://your-app.vercel.app/privacy
- Terms: https://your-app.vercel.app/terms

## 💰 Cost Breakdown

| Service | Cost | Quota |
|---------|------|-------|
| YouTube API | FREE | 10,000/day |
| OpenRouter AI | FREE | $5/month credits |
| Hosting (Vercel) | FREE | Unlimited |
| Hosting (Render) | FREE | 750 hrs/month |
| **TOTAL** | **$0** | **∞** |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, React
- **Backend**: Node.js, Express
- **AI**: OpenRouter (gpt-4o-mini)
- **APIs**: YouTube Data API, TikTok API, Instagram Graph API, Facebook Graph API
- **Hosting**: Vercel, Render

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to submit PRs.

## ⚠️ Disclaimer

This tool is for educational purposes. Ensure you have rights to the content you process and comply with all platform terms of service.
