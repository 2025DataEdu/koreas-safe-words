
export const translateText = async (text: string, targetLanguage: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in emergency disaster messages from Korean government authorities. 

CRITICAL TRANSLATION GUIDELINES:
1. Maintain URGENCY and CLARITY in all translations
2. Use FORMAL, OFFICIAL tone appropriate for government emergency communications
3. Be PRECISE with disaster terminology - no approximations
4. Consider cultural context for emergency instructions
5. Prioritize ACTIONABLE language over literal translation

COMMON KOREAN DISASTER TERMS TO HANDLE CAREFULLY:
- 풍랑경보 = Storm/Wave Warning (not just "windy weather")
- 여진 = Aftershock (not "earthquake again") 
- 대피 = Evacuation (urgent action, not just "leaving")
- 행정명령 = Administrative Order (official government directive)
- 긴급재난문자 = Emergency Disaster Message

AMBIGUOUS TERMS TO WATCH FOR:
- 전주 (city name vs "previous week")
- 수원 (city name vs "water source") 
- 광주 (city name - specify which one)
- 공습 (air raid - use only if genuinely about military attack)

Target language: ${getLanguageName(targetLanguage)}
Translate the following Korean emergency message:`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('번역 서비스에 연결할 수 없습니다.');
  }
};

export const reverseTranslateText = async (text: string, originalLanguage: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Translate the following emergency message back to Korean. This is for quality verification - maintain the same meaning and urgency level.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Reverse translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Reverse translation error:', error);
    throw new Error('역번역 서비스에 연결할 수 없습니다.');
  }
};

const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'zh': 'Chinese (Simplified)',
    'ja': 'Japanese', 
    'vi': 'Vietnamese',
    'th': 'Thai'
  };
  return languages[code] || 'Unknown';
};
