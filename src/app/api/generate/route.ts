import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';
import { PROTOCOL_GENERATION_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'GEMINI_API_KEY not configured. Add it to .env.local' },
        { status: 500 }
      );
    }

    const { conversationHistory } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Build context from the conversation
    const conversationSummary = conversationHistory
      .map((msg: { role: string; content: string }) => `${msg.role === 'user' ? 'USER' : 'CONSULTANT'}: ${msg.content}`)
      .join('\n');

    const prompt = `${PROTOCOL_GENERATION_PROMPT}\n\nHere is the completed intake screening conversation:\n\n${conversationSummary}\n\nBased on this screening, generate the structured protocol JSON now. Use today's date (${new Date().toISOString().split('T')[0]}) as the starting point for milestone dates.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let protocol;
    try {
      protocol = JSON.parse(text);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        protocol = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse protocol JSON from AI response');
      }
    }

    // Add an ID and creation timestamp
    protocol.id = `proto-${Date.now()}`;
    protocol.createdAt = new Date().toISOString();

    return Response.json({ protocol });
  } catch (error) {
    console.error('Generate API error:', error);
    return Response.json(
      { error: 'Failed to generate protocol' },
      { status: 500 }
    );
  }
}
