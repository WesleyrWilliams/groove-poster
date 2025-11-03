# 📊 Google Sheets Setup Guide

## ✅ Your Google Sheet

**Sheet URL**: https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit

**Spreadsheet ID**: `1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ`

---

## 🎯 Step-by-Step: Connect to Vercel

### Step 1: Verify Sheet Tab Name

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit
2. Check if you have a tab named: **"Trending Videos"**
3. If not, create it:
   - Click the "+" button at the bottom
   - Name it: **"Trending Videos"**

### Step 2: Add Spreadsheet ID to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com
   - Sign in
   - Select your **`groove-poster-backend`** project

2. **Navigate to Environment Variables:**
   - Click **Settings** (left sidebar)
   - Click **Environment Variables**

3. **Add New Variable:**
   - Click **"Add New"** button
   - **Variable Name**: `GOOGLE_SHEET_ID`
   - **Value**: `1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete (~1-2 minutes)

---

## ✅ Verification

After adding the environment variable and redeploying:

### Test the Connection:

```bash
curl -X POST https://groove-poster-backend.vercel.app/api/trending-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "maxResults": 10,
    "topCount": 3,
    "extractClip": true,
    "uploadToYouTube": false
  }'
```

### Check Your Sheet:

1. Open your Google Sheet
2. Go to **"Trending Videos"** tab
3. You should see:
   - Headers in row 1 (Channel Name, Video Title, Link, etc.)
   - Data rows with trending videos (after workflow runs)

---

## 📝 Sheet Format

The workflow will automatically create this structure:

| Channel Name | Video Title | Link | Trend Score | Reason for Selection | View Count | Like Count | Views/Hour | Like Ratio % | Published Date | Status |
|-------------|-------------|------|-------------|---------------------|------------|------------|------------|--------------|----------------|--------|
| Creator Name | Video Title | URL | 85.5 | High engagement | 1000000 | 50000 | 5000 | 5.0 | 2025-11-02 | Selected |

---

## 🔒 Permissions

✅ **Already Set Up:**
- OAuth connection includes `spreadsheets` scope
- Your Google account (`litloopy2005@gmail.com`) is authorized
- No additional permissions needed

**Note**: Make sure the Google account you used for OAuth owns or has edit access to this sheet.

---

## 🚀 Quick Start

Once `GOOGLE_SHEET_ID` is added to Vercel:

1. ✅ Environment variable added
2. ✅ Backend redeployed
3. ✅ Run trending workflow
4. ✅ Check Google Sheet for results

---

## 📋 Checklist

- [ ] Verified "Trending Videos" tab exists in your sheet
- [ ] Added `GOOGLE_SHEET_ID` to Vercel environment variables
- [ ] Value: `1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ`
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed backend
- [ ] Tested workflow (should save to sheet)

---

## 🎉 That's It!

Your Google Sheet is ready to receive trending video data!

**Next**: Run the trending workflow and watch your sheet populate automatically! 🚀
