# ⚡ Quick Connect: Google Sheet to Vercel

## 📋 Your Sheet Details

**Spreadsheet ID**: `1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ`

**Sheet URL**: https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit

---

## 🎯 3 Steps to Connect

### Step 1: Verify Sheet Tab (30 seconds)

1. Open your sheet: https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit
2. Check bottom tabs - do you see **"Trending Videos"**?
3. If not:
   - Click **"+"** button
   - Name it: **"Trending Videos"**

### Step 2: Add to Vercel (1 minute)

1. Go to: https://vercel.com/dashboard
2. Click **`groove-poster-backend`** project
3. **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Fill in:
   ```
   Name: GOOGLE_SHEET_ID
   Value: 1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ
   Environment: All (Production, Preview, Development)
   ```
6. Click **Save**

### Step 3: Redeploy (1 minute)

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **Redeploy**
4. Wait ~1-2 minutes

---

## ✅ Test It

After redeploy, test:

```bash
curl -X POST https://groove-poster-backend.vercel.app/api/trending-workflow \
  -H "Content-Type: application/json" \
  -d '{"maxResults": 10, "topCount": 3}'
```

Then check your Google Sheet - you should see trending videos appear! 🎉

---

## 🎯 That's It!

**Total time**: ~3 minutes

Your sheet is now connected and ready to receive trending video data! 🚀

