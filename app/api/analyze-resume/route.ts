import { NextRequest, NextResponse } from 'next/server'
import { analyzeResume } from '@/lib/gemini'
import { parsePdf } from '@/lib/resume-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get('resume') as File | null
    const targetRole = formData.get('targetRole') as string
    const jobDescription = formData.get('jobDescription') as string | undefined

    if (!resumeFile || !targetRole) {
      return NextResponse.json({ error: 'Resume and target role are required' }, { status: 400 })
    }

    // Parse the resume file (PDF or text)
    let resumeText = ''
    if (resumeFile.type === 'application/pdf') {
      const arrayBuffer = await resumeFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      resumeText = await parsePdf(buffer as any)
    } else {
      // For other formats, read as text
      resumeText = await resumeFile.text()
    }

    const analysis = await analyzeResume(resumeText, targetRole, jobDescription)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Resume analysis route error:', error)
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }
}
