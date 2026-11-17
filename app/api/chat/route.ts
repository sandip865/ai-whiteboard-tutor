import { NextRequest, NextResponse } from 'next/server';
import { answerFollowUpQuestion } from '@/lib/aiLessonGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, lesson, chatHistory = [], apiKey } = body;

    if (!question || !lesson) {
      return NextResponse.json({ error: 'Missing question or lesson' }, { status: 400 });
    }

    const result = await answerFollowUpQuestion(question, lesson, chatHistory, apiKey);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to answer question' },
      { status: 500 }
    );
  }
}
