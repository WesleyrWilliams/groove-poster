import { google } from 'googleapis';
import { getAccessToken } from './oauth-tokens.js';

let sheetsClient = null;

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  
  // Use OAuth access token instead of service account
  const accessToken = await getAccessToken();
  
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  sheetsClient = google.sheets({ version: 'v4', auth: oauth2Client });
  return sheetsClient;
}

export async function saveToGoogleSheets(data) {
  try {
    const client = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = 'GrooveSzn Auto Clipper';
    
    // Deep logging with metadata (OpusAI-style)
    const timestamp = new Date().toISOString();
    const clipData = data.clips || [];
    const firstClip = clipData[0] || {};
    
    await client.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:O`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.videoId || '',
          data.projectId || '',
          data.videoUrl || '',
          data.videoMsDuration || data.duration || '',
          data.title || '',
          data.transcript || '',
          firstClip.trend_score || data.viralScore || '',
          data.viralReason || firstClip.reason || '',
          data.relatedTopic || data.hashtags?.join(', ') || '',
          data.clipEditorUrl || '',
          data.generatedCaption || data.subtitle || '',
          data.tiktokUploadStatus || 'pending',
          data.instagramUploadStatus || 'pending',
          data.youtubeUploadStatus || 'pending',
          data.facebookUploadStatus || 'pending',
        ]],
      },
    });
    
    // Log additional metadata if available
    if (clipData.length > 0) {
      console.log(`📊 Logged to Sheets: ${clipData.length} clips, trend_score: ${firstClip.trend_score || 'N/A'}, emotion: ${firstClip.emotion || 'N/A'}`);
    } else {
      console.log('📊 Saved to Google Sheets');
    }
  } catch (error) {
    console.error('Error saving to Google Sheets:', error.message);
    // Don't throw - allow workflow to continue even if Sheets fails
  }
}

