# 🔐 Google OAuth 2.0 Setup

## ✅ OAuth Credentials Configured

Your Google OAuth credentials have been added to the backend:

```env
GOOGLE_CLIENT_ID=11350076735-cob2brq009olskprupsdg91t0a33ipud.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://groove-poster-backend.vercel.app/oauth2callback
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
```

## 📝 Environment Variables for Vercel

Add these to your Vercel backend project:

1. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
2. Add each variable:

| Variable | Value |
|---------|-------|
| `GOOGLE_CLIENT_ID` | `11350076735-cob2brq009olskprupsdg91t0a33ipud.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `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` |
| `GOOGLE_REDIRECT_URI` | `https://groove-poster-backend.vercel.app/oauth2callback` |
| `GOOGLE_AUTH_URI` | `https://accounts.google.com/o/oauth2/auth` |
| `GOOGLE_TOKEN_URI` | `https://oauth2.googleapis.com/token` |

## 🔗 OAuth Endpoints

### 1. Initiate OAuth Flow
```
GET /oauth2
```
Redirects to Google OAuth consent screen.

**Live URL**: `https://groove-poster-backend.vercel.app/oauth2`

### 2. OAuth Callback Handler
```
GET /oauth2callback?code=...
```
Handles the callback from Google and exchanges code for tokens.

**Live URL**: `https://groove-poster-backend.vercel.app/oauth2callback`

## 🎯 OAuth Scopes

The OAuth flow requests these scopes:
- `https://www.googleapis.com/auth/youtube.upload` - Upload videos to YouTube
- `https://www.googleapis.com/auth/spreadsheets` - Access Google Sheets

## 🚀 How to Use

### Step 1: Add Environment Variables to Vercel
1. Go to Vercel Dashboard
2. Select `groove-poster-backend` project
3. Settings → Environment Variables
4. Add all 5 Google OAuth variables listed above
5. Redeploy

### Step 2: Test OAuth Flow
1. Visit: `https://groove-poster-backend.vercel.app/oauth2`
2. You'll be redirected to Google to authorize
3. After authorization, you'll be redirected back to `/oauth2callback`
4. You'll see your access token and refresh token (if provided)

### Step 3: Use Tokens
The tokens returned can be used to:
- Upload videos to YouTube
- Access Google Sheets
- Make authenticated Google API requests

## ⚠️ Security Notes

- **Never commit** `GOOGLE_CLIENT_SECRET` to Git
- Store tokens securely (database, secure storage)
- In production, implement token refresh logic
- Never expose tokens in frontend code

## 📚 Related Documentation

- Google OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- YouTube API: https://developers.google.com/youtube/v3
- Google Sheets API: https://developers.google.com/sheets/api

## ✅ Verification

Your OAuth configuration matches Google Cloud Console:
- ✅ Client ID: `11350076735-cob2brq009olskprupsdg91t0a33ipud.apps.googleusercontent.com`
- ✅ Redirect URI: `https://groove-poster-backend.vercel.app/oauth2callback`
- ✅ JavaScript Origins:
  - `https://groove-poster-frontend.vercel.app`
  - `https://groove-poster-backend.vercel.app`

