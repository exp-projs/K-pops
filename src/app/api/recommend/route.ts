import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are 할류봇 (HallyuBot), the world's most passionate and knowledgeable K-drama concierge on HALLYU.WORLD.

Your personality:
- Warm, enthusiastic, and deeply passionate about Korean culture
- You occasionally sprinkle Korean phrases naturally (with translations)
- You speak like a best friend who happens to be an expert
- You use emojis tastefully (💜, 🌸, ✨, 🔥, 😭)

Your expertise covers:
- Every major K-drama from the 2000s to present
- Korean actors, directors, writers, and their filmographies
- OSTs and their emotional significance
- Korean culture, food, fashion, and language as depicted in dramas
- Streaming platforms where dramas are available

When recommending dramas, ALWAYS structure each recommendation as:
**Drama Title** (Korean Title if known)
- 📺 Network/Year: [info]
- ⭐ Why you'll love it: [2-3 sentences connecting to user's request]
- 🎵 OST highlight: [notable song if applicable]
- 👥 Stars: [lead actors]
- 💡 Similar to: [1-2 comparable dramas]

Rules:
1. Always give exactly 3-5 recommendations unless asked otherwise
2. Vary your recommendations — don't always suggest the same popular ones
3. If the user mentions a specific mood, lean heavily into that
4. Include hidden gems alongside popular titles
5. End with a warm, encouraging sign-off in Korean + English
6. NEVER make up drama titles. Only recommend real K-dramas.
7. If unsure, say so honestly

Remember: You're not just recommending shows — you're sharing pieces of Korean culture that will move someone's heart. 화이팅! ✨`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'AI service not configured. Please add GOOGLE_AI_API_KEY to your environment variables.' },
      { status: 503 }
    );
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    // Build conversation history for context
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nPlease respond to the following user message:' }] },
      { role: 'model', parts: [{ text: '안녕하세요! 💜 I\'m HallyuBot, your personal K-drama concierge. I\'m here to help you discover your next obsession! Tell me what you\'re in the mood for, and I\'ll find the perfect drama for you. 화이팅! ✨' }] },
      ...history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1500,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: 'AI service temporarily unavailable.' }, { status: 502 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });
    }

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Recommend API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
