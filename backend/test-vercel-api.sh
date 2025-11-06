#!/bin/bash

# Test the OpusAI-style pipeline on Vercel
# This will work because Vercel has proper network access

API_URL="https://groove-poster-backend.vercel.app"
VIDEO_URL="https://youtu.be/oBXSvS2QKxU?si=NnVhjK76wW9C68UJ"

echo "🧪 Testing OpusAI-style Pipeline on Vercel..."
echo "📹 Video: $VIDEO_URL"
echo ""

# Test the 5-clip processing endpoint
curl -X POST "${API_URL}/api/process-5-clips" \
  -H "Content-Type: application/json" \
  -d "{
    \"videoUrl\": \"${VIDEO_URL}\",
    \"uploadToYouTube\": true
  }" \
  | jq '.'

echo ""
echo "✅ Request sent! Check Vercel logs for progress:"
echo "   https://vercel.com/dashboard"
echo ""
echo "📊 To check logs in real-time:"
echo "   - Go to Vercel Dashboard → Your Project → Logs"
echo "   - Look for messages starting with:"
echo "     📝 Getting transcript (OpusAI-style)..."
echo "     🎵 Extracting audio..."
echo "     🤖 Analyzing video with AI..."
echo "     ✂️ Processing clips..."
echo "     📤 Uploading to YouTube..."

