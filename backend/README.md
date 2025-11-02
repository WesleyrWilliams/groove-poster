# Shorts Generator Backend

Self-hosted backend API for the TikTok/Instagram Shorts Generator.

## Features

- Process single YouTube videos
- Monitor YouTube channels
- Generate captions using OpenRouter (free tier)
- Upload to TikTok, Instagram, YouTube, Facebook
- Save to Google Sheets
- Webhook support for Vizard callbacks

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Create `.env` file**:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. **Start server**:
```bash
npm run dev
# or
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### POST `/api/process-video`
Process a single YouTube video.

**Request**:
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Video processing started",
  "projectId": "12345"
}
```

### POST `/api/process-channel`
Monitor and process videos from a YouTube channel.

**Request**:
```json
{
  "channelId": "UCbo-KbSjJDG6JWQ_MTZ_rNA",
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Channel monitoring started",
  "videosProcessed": 2
}
```

### POST `/webhook/vizard`
Webhook endpoint for Vizard callbacks.

**Request**:
```json
{
  "projectId": "12345"
}
```

### GET `/health`
Health check endpoint.

## Environment Variables

See `.env.example` for all required variables.

**Required**:
- `VIZARD_API_KEY` - Your Vizard AI API key
- `OPENROUTER_API_KEY` - Your OpenRouter API key (free tier available)

**Optional**:
- Social media API tokens (TikTok, Instagram, YouTube, Facebook)
- Google Sheets credentials
- `OPENROUTER_MODEL` - Model to use (default: `openai/gpt-4o-mini`)

## Deployment

See `DEPLOYMENT_GUIDE.md` for deployment instructions to Render or Vercel.

