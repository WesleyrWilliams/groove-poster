# Full Pipeline Test

Comprehensive test for the entire Groove Poster workflow.

## Quick Test (Fast - Skips Download/Upload)

```bash
SKIP_DOWNLOAD=true SKIP_UPLOAD=true npm run test:pipeline
```

This will test:
- ✅ Fetch trending videos
- ✅ Get video details
- ✅ Transcribe (or use fallback)
- ✅ AI highlight detection (or use fallback)
- ❌ Skip video download
- ❌ Skip upload
- ✅ Log to Google Sheets

## Full Test (Slow - Downloads & Processes Video)

```bash
npm run test:pipeline
```

This will test the complete pipeline including video download and processing.

## Test with Upload

```bash
UPLOAD_TO_YOUTUBE=true npm run test:pipeline
```

⚠️ **Warning**: This will actually upload a video to your YouTube channel!

## Test via API

```bash
curl -X POST https://groove-poster-backend.vercel.app/api/test-pipeline
```

## Environment Variables

- `TEST_VIDEO_URL` - Specific video to test (default: trending video)
- `SKIP_DOWNLOAD=true` - Skip video download step (faster)
- `SKIP_UPLOAD=true` - Skip upload step
- `UPLOAD_TO_YOUTUBE=true` - Enable YouTube upload

## What Gets Tested

1. **Trend Fetching** - YouTube API trending search
2. **Video Details** - Get video metadata
3. **Transcription** - Whisper API (Hugging Face)
4. **AI Highlight Detection** - OpenRouter for clip detection
5. **Video Processing** - FFmpeg clip creation + 9:16 layout
6. **YouTube Upload** - Upload to YouTube Shorts
7. **Google Sheets Logging** - Log results to spreadsheet

## Expected Results

- ✅ All steps complete successfully
- ⚠️ Some steps may use fallbacks (e.g., no transcript → timeline-based clips)
- ❌ Upload may fail if OAuth not configured (test continues)

