import axios from 'axios';

export async function getTranscript(videoId) {
  try {
    // Try YouTube transcript API (free, no key needed)
    const response = await axios.get(
      `https://www.youtube.com/api/timedtext`,
      {
        params: {
          v: videoId,
          lang: 'en',
          fmt: 'json3',
        },
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
      
      return transcript;
    }
    
    throw new Error('No transcript available');
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    
    // Fallback: Return empty transcript
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

