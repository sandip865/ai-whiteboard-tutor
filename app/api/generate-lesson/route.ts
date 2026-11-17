import { NextRequest, NextResponse } from 'next/server';
import { generateLessonPlan } from '@/lib/aiLessonGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, apiKey, difficulty = 'Intermediate' } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
    }

    const result = await generateLessonPlan(topic, apiKey, 'auto', difficulty);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generate-lesson API route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}
