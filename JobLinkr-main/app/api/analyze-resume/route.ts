import { NextResponse } from 'next/server'
import { analyzeResume } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { resumeText, targetRole } = await request.json()

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 })
    }

    const analysis = await analyzeResume(resumeText, targetRole)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Resume analysis route error:', error)
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }
}
