# Shorts Generator Frontend

A Next.js frontend interface for triggering the TikTok/Instagram Shorts Generator workflow.

## Features

- Trigger workflow with a single YouTube video URL
- Monitor YouTube channels automatically
- Beautiful, modern UI with Tailwind CSS
- Real-time status updates
- Support for multiple languages

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/frontend-trigger-id
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable `N8N_WEBHOOK_URL` with your n8n webhook URL
4. Deploy!

### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variable `N8N_WEBHOOK_URL`
6. Deploy!

## Environment Variables

- `N8N_WEBHOOK_URL` - Your n8n webhook URL for the frontend trigger node

