# 🔍 Debug Google Sheets Connection

## Quick Diagnostic

### Step 1: Check Configuration

Visit this URL to check if `GOOGLE_SHEET_ID` is set:

```
https://groove-poster-backend.vercel.app/api/sheets/check
```

**Expected Response if configured:**
```json
{
  "configured": true,
  "sheetId": "1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ",
  "expectedSheetId": "1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ",
  "oauthConnected": true,
  "instructions": "✅ GOOGLE_SHEET_ID is set. Check Vercel logs for errors.",
  "sheetUrl": "https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit"
}
```

**If NOT configured:**
```json
{
  "configured": false,
  "sheetId": "NOT SET",
  "expectedSheetId": "1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ",
  "oauthConnected": true,
  "instructions": "⚠️ Add GOOGLE_SHEET_ID to Vercel environment variables"
}
```

---

## Common Issues & Fixes

### Issue 1: `GOOGLE_SHEET_ID` Not Set

**Symptom**: Sheet is empty, diagnostic shows `"configured": false`

**Fix**:
1. Go to Vercel Dashboard → `groove-poster-backend` → Settings → Environment Variables
2. Add: `GOOGLE_SHEET_ID` = `1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ`
3. Redeploy

---

### Issue 2: Wrong Sheet ID

**Symptom**: Sheet is empty, diagnostic shows different ID

**Fix**:
1. Check diagnostic endpoint: `/api/sheets/check`
2. Verify `sheetId` matches: `1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ`
3. Update in Vercel if different
4. Redeploy

---

### Issue 3: OAuth Permission Error

**Symptom**: 403 error in logs, "permission denied"

**Fix**:
1. Re-run OAuth: Visit `/oauth2`
2. Make sure you authorize with **all scopes** (including spreadsheets)
3. Copy new refresh token
4. Update `GOOGLE_REFRESH_TOKEN` in Vercel
5. Redeploy

---

### Issue 4: Sheet Tab Doesn't Exist

**Symptom**: Error in logs about "Trending Videos" tab

**Fix**:
- The code now auto-creates the tab
- Or manually create tab named: **"Trending Videos"**

---

## Check Vercel Logs

1. Go to Vercel Dashboard
2. Your Backend Project → Deployments
3. Latest deployment → Logs
4. Look for:
   - ✅ `📊 Saving to Google Sheets...`
   - ✅ `✅ Saved X videos to Google Sheets`
   - ❌ Error messages (check above fixes)

---

## Test After Fix

After fixing, run:

```bash
curl -X POST https://groove-poster-backend.vercel.app/api/trending-workflow \
  -H "Content-Type: application/json" \
  -d '{"maxResults": 5, "topCount": 3}'
```

Then check your sheet: https://docs.google.com/spreadsheets/d/1wkkQa2SFHRpvZS8HJ9j3BVTIbnAWA0xKA_Gwysch2WQ/edit

---

## Quick Checklist

- [ ] Check `/api/sheets/check` - shows `configured: true`
- [ ] Verify `GOOGLE_SHEET_ID` in Vercel
- [ ] Verify `GOOGLE_REFRESH_TOKEN` in Vercel
- [ ] Redeploy after adding variables
- [ ] Check Vercel logs for errors
- [ ] Verify sheet has "Trending Videos" tab

