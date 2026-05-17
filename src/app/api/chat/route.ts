import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';
import { ONBOARDING_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'GEMINI_API_KEY not configured. Add it to .env.local' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Build the conversation history for Gemini
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'System instructions: ' + ONBOARDING_SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am Protocol\'s Onboarding Consultant. I will conduct a clinical, structured intake screening. Ready for the user\'s goal.' }],
        },
        ...messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    return Response.json({ content: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
