import { google } from 'googleapis';

let sheetsClient = null;

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export async function saveToGoogleSheets(data) {
  try {
    const client = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = 'Shorts';
    
    await client.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:O`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.videoId || '',
          data.projectId || '',
          data.videoUrl || '',
          data.videoMsDuration || '',
          data.title || '',
          data.transcript || '',
          data.viralScore || '',
          data.viralReason || '',
          data.relatedTopic || '',
          data.clipEditorUrl || '',
          data.generatedCaption || '',
          data.tiktokUploadStatus || 'pending',
          data.instagramUploadStatus || 'pending',
          data.youtubeUploadStatus || 'pending',
          data.facebookUploadStatus || 'pending',
        ]],
      },
    });
    
    console.log('Saved to Google Sheets');
  } catch (error) {
    console.error('Error saving to Google Sheets:', error.message);
    // Don't throw - allow workflow to continue even if Sheets fails
  }
}

