import { NextResponse } from 'next/server'
import { scoreJobAgainstProfile } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { resumeText, jobTitle, jobDescription } = await request.json()

    if (!resumeText || !jobTitle) {
      return NextResponse.json({ error: 'Missing required data for scoring' }, { status: 400 })
    }

    const scoring = await scoreJobAgainstProfile(resumeText, jobTitle, jobDescription)
    return NextResponse.json(scoring)
  } catch (error) {
    console.error('Job scoring route error:', error)
    return NextResponse.json({ error: 'Failed to score job fit' }, { status: 500 })
  }
}
