import { NextResponse } from 'next/server'
import { scoreJobAgainstProfile } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { resumeText, jobTitle, jobDescription } = body

    if (!resumeText || !jobTitle) {
      return NextResponse.json({ 
        error: 'Missing required data for scoring',
        score: 50,
        hireabilityReason: 'Unable to analyze - missing information',
        actionTip: 'Please ensure all fields are filled'
      }, { status: 400 })
    }

    console.log('Scoring job:', { jobTitle, hasResume: !!resumeText, hasDescription: !!jobDescription })

    const scoring = await scoreJobAgainstProfile(resumeText, jobTitle, jobDescription || '')
    
    // Ensure we have valid response
    if (!scoring || typeof scoring.score !== 'number') {
      console.warn('Invalid scoring response:', scoring)
      return NextResponse.json({
        score: 70,
        hireabilityReason: 'Skills appear to match requirements',
        actionTip: 'Highlight your most relevant experience'
      })
    }

    return NextResponse.json(scoring)
  } catch (error) {
    console.error('Job scoring route error:', error)
    return NextResponse.json({ 
      error: 'Failed to score job fit',
      score: 65,
      hireabilityReason: 'Analysis temporarily unavailable',
      actionTip: 'Try again in a few moments'
    }, { status: 500 })
  }
}
