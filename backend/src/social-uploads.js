import axios from 'axios';
import FormData from 'form-data';

export async function uploadToTikTok(videoUrl, title, caption) {
  try {
    // Note: TikTok API requires video file upload, not URL
    // This is a simplified version - you'll need to download the video first
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/',
      {
        post_info: {
          title: title,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_url: videoUrl,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return { platform: 'tiktok', status: 'success', data: response.data };
  } catch (error) {
    console.error('TikTok upload error:', error.response?.data || error.message);
    throw error;
  }
}

export async function uploadToInstagram(videoUrl, caption) {
  try {
    // Step 1: Create media container
    const createResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        media_type: 'REELS',
        video_url: videoUrl,
        caption: caption,
      },
      {
        params: {
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        },
      }
    );
    
    const containerId = createResponse.data.id;
    
    // Step 2: Publish the container
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
      {
        creation_id: containerId,
      },
      {
        params: {
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        },
      }
    );
    
    return { platform: 'instagram', status: 'success', containerId };
  } catch (error) {
    console.error('Instagram upload error:', error.response?.data || error.message);
    throw error;
  }
}

export async function uploadToYouTube(videoUrl, title, caption, relatedTopic) {
  try {
    // Note: YouTube API also requires video file upload
    // This is a simplified version showing the metadata upload
    const response = await axios.post(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        snippet: {
          title: title,
          description: caption,
          categoryId: '22',
          tags: ['shorts', relatedTopic || ''],
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.YOUTUBE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return { platform: 'youtube', status: 'success', data: response.data };
  } catch (error) {
    console.error('YouTube upload error:', error.response?.data || error.message);
    throw error;
  }
}

export async function uploadToFacebook(videoUrl, title, caption) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/videos`,
      {
        file_url: videoUrl,
        title: title,
        description: caption,
      },
      {
        params: {
          access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        },
      }
    );
    
    return { platform: 'facebook', status: 'success', videoId: response.data.id };
  } catch (error) {
    console.error('Facebook upload error:', error.response?.data || error.message);
    throw error;
  }
}

