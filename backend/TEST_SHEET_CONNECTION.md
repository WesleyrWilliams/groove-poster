# 🧪 Test Google Sheets Connection

## ✅ Quick Test Methods

### Method 1: Run Trending Workflow (Recommended)

This will test the full connection and save real data to your sheet.

#### Using cURL:
```bash
curl -X POST https://groove-poster-backend.vercel.app/api/trending-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "maxResults": 5,
    "topCount": 3,
    "extractClip": false,
    "uploadToYouTube": false
  }'
```

#### Using Browser:
1. Open browser console (F12)
2. Run:
```javascript
fetch('https://groove-poster-backend.vercel.app/api/trending-workflow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    maxResults: 5,
    topCount: 3,
    extractClip: false,
    uploadToYouTube: false
  })
})
.then(r => r.json())
.then(console.log)
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Trending workflow started",
  "note": "Processing in background - check logs for progress",
  "options": {
    "maxResults": 5,
    "topCount": 3,
    "extractClip": false,
    "uploadToYouTube": false
  }
}
```

---

## ✅ Verification Steps

### Step 1: Check API Response

After running the test, you should see:
- ✅ `"success": true`
- ✅ Response received immediately

If you see an error:
- ❌ Check `GOOGLE_SHEET_ID` is set in Vercel
- ❌ Check backend was redeployed after adding variable

---

### Step 2: Check Vercel Logs

1. Go to Vercel Dashboard
2. Your Backend Project → **Deployments**
3. Click on latest deployment
4. Click **"View Function Logs"** or **"Logs"** tab
5. Look for:
   - ✅ `📊 Saving to Google Sheets...`
   - ✅ `✅ Saved X videos to Google Sheets`
   - ❌ If you see errors, check the error message

---

### Step 3: Check Your Google Sheet

1. Open your sheet: https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit
2. Go to **"Trending Videos"** tab
3. You should see:

#### ✅ Success Indicators:
- **Row 1**: Headers appear:
  - Channel Name | Video Title | Link | Trend Score | Reason | View Count | Like Count | Views/Hour | Like Ratio % | Published Date | Status
- **Row 2+**: Data rows with trending videos
- Each row has:
  - Channel name
  - Video title
  - YouTube link
  - Trend score (number)
  - Reason for selection

#### ❌ If Sheet is Empty:
- Check Vercel logs for errors
- Verify `GOOGLE_SHEET_ID` is correct
- Check OAuth permissions (should be fine)

---

## 🔍 Detailed Test Process

### Test 1: Verify Environment Variable

```bash
# Check if endpoint responds
curl https://groove-poster-backend.vercel.app/health
```

Should return: `{"status":"ok",...}`

### Test 2: Run Small Workflow

```bash
curl -X POST https://groove-poster-backend.vercel.app/api/trending-workflow \
  -H "Content-Type: application/json" \
  -d '{"maxResults": 3, "topCount": 2}'
```

### Test 3: Check Sheet (Wait 30-60 seconds)

1. Open Google Sheet
2. Refresh the page
3. Check "Trending Videos" tab
4. Should see data

---

## 🐛 Troubleshooting

### Issue: Sheet is Empty

**Possible Causes:**
1. `GOOGLE_SHEET_ID` not set in Vercel
2. Backend not redeployed after adding variable
3. Wrong spreadsheet ID
4. OAuth permission issue

**Fix:**
1. Verify `GOOGLE_SHEET_ID` in Vercel Settings
2. Check value matches: `1U-vA2-4nHS1FsaMcjZjKCr1H8WPqTnVBeCKTEdTr_HM`
3. Redeploy backend
4. Check Vercel logs for specific errors

---

### Issue: API Returns Error

**Check Response:**
```json
{
  "error": "...",
  "message": "..."
}
```

**Common Errors:**
- `GOOGLE_SHEET_ID not configured` → Add to Vercel
- `Failed to refresh access token` → Check OAuth refresh token
- `Permission denied` → Check OAuth scopes

---

### Issue: "Trending Videos" Tab Not Found

**Fix:**
1. Create the tab manually in Google Sheets
2. Name it exactly: **"Trending Videos"** (case-sensitive)
3. Try workflow again

---

## ✅ Success Checklist

After running test:

- [ ] API returns `{"success": true}`
- [ ] Vercel logs show "Saving to Google Sheets"
- [ ] Vercel logs show "Saved X videos to Google Sheets"
- [ ] Google Sheet "Trending Videos" tab has headers
- [ ] Google Sheet has data rows with videos
- [ ] Each row has: Channel, Title, Link, Score, Reason

---

## 🎯 Quick Test Command

Copy and paste this in your terminal:

```bash
curl -X POST https://groove-poster-backend.vercel.app/api/trending-workflow \
  -H "Content-Type: application/json" \
  -d '{"maxResults": 5, "topCount": 3}' && \
echo "\n\n✅ Check your Google Sheet: https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit\n"
```

Then:
1. ✅ Wait 30-60 seconds
2. ✅ Open your Google Sheet
3. ✅ Check "Trending Videos" tab
4. ✅ See trending videos! 🎉

---

## 📊 Expected Sheet Content

After successful test, your sheet should look like:

| Channel Name | Video Title | Link | Trend Score | Reason | View Count | Like Count | Views/Hour | Like Ratio % | Published Date | Status |
|-------------|-------------|------|-------------|--------|------------|------------|------------|--------------|----------------|--------|
| IShowSpeed | Gaming Highlights | https://youtube.com/... | 95.5 | Spike: 5000 views/hour | 1000000 | 50000 | 5000 | 5.0 | 2025-11-02 | Selected |
| Kai Cenat | Reacting to... | https://youtube.com/... | 88.2 | High engagement | 850000 | 42000 | 3500 | 4.9 | 2025-11-02 | Selected |

---

## 🎉 Success!

If you see data in your sheet:
- ✅ Connection working!
- ✅ OAuth configured correctly
- ✅ Workflow functioning
- ✅ Ready for full automation!

**You're all set!** 🚀

