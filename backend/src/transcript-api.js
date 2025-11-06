import axios from 'axios';

export async function getTranscript(videoId) {
  try {
    // Try YouTube transcript API (free, no key needed)
    // Try multiple languages in order
    const languages = ['en', 'en-US', 'en-GB', 'auto'];
    
    for (const lang of languages) {
      try {
        const response = await axios.get(
          `https://www.youtube.com/api/timedtext`,
          {
            params: {
              v: videoId,
              lang: lang,
              fmt: 'json3',
            },
            timeout: 10000,
          }
        );
        
        if (response.data && response.data.events) {
          const transcript = response.data.events
            .filter(event => event.segs)
            .map(event => ({
              text: event.segs.map(seg => seg.utf8).join(''),
              start: event.tStartMs / 1000,
              duration: event.dDurationMs / 1000,
            }))
            .filter(item => item.text.trim().length > 0);
          
          if (transcript.length > 0) {
            console.log(`✅ Got transcript in ${lang} (${transcript.length} segments)`);
            return transcript;
          }
        }
      } catch (langError) {
        // Try next language
        continue;
      }
    }
    
    // No transcript found in any language
    throw new Error('No transcript available in any language');
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    console.warn('⚠️ Note: Some videos don\'t have captions. Use a video with captions enabled, or the system will use timeline-based clips.');
    
    // Fallback: Return empty transcript (will use timeline-based clips)
    return [];
  }
}

export async function getBestMoments(transcript, numClips = 3) {
  // Simple heuristic: Find segments with most engaging words
  const engagingWords = [
    'incredible', 'amazing', 'unbelievable', 'shocking', 'wow', 'wow',
    'finally', 'actually', 'really', 'absolutely', 'perfect', 'best',
    'never', 'always', 'everything', 'nothing', 'mind', 'blown',
    'surprising', 'secret', 'truth', 'important', 'key', 'crucial'
  ];
  
  // Score each segment
  const scoredSegments = transcript.map(segment => {
    const text = segment.text.toLowerCase();
    const score = engagingWords.reduce((count, word) => {
      return count + (text.includes(word) ? 1 : 0);
    }, 0);
    
    return {
      ...segment,
      score: score + Math.random() * 2, // Add some randomness
    };
  });
  
  // Sort by score and get top N
  const bestMoments = scoredSegments
    .sort((a, b) => b.score - a.score)
    .slice(0, numClips)
    .map(segment => ({
      start: segment.start,
      end: segment.start + segment.duration,
      text: segment.text,
      score: segment.score,
    }));
  
  return bestMoments;
}

