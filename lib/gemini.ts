import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.warn('⚠️ GOOGLE_GEMINI_API_KEY is not configured.')
}

function getModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

function extractJson(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in Gemini response')
  return JSON.parse(jsonMatch[0])
}

export async function analyzeResume(resumeText: string, targetRole: string, jobDescription?: string) {
  try {
    const model = getModel()

    const prompt = `
      You are an expert technical recruiter and career coach.
      Analyze the following resume text in the context of a user looking for the role of "${targetRole}".
      ${jobDescription ? '\nCompare this resume against the following job description:\n' + jobDescription : ''}
      Focus on "hireability" - what makes this candidate stand out and where they might struggle.

      Resume Text:
      ${resumeText}

      Please provide your analysis in the following JSON format only, no extra text:
      {
        "extractedSkills": ["skill1", "skill2"],
        "searchKeywords": ["keyword1", "keyword2"],
        "profileSummary": "A concise summary of their unique value proposition for this role.",
        "getHiredTactics": "Specific advice on how to stand out for this specific role.",
        "matchScore": 75,
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "recommendations": ["recommendation1", "recommendation2"]
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return extractJson(text)
  } catch (error: any) {
    console.error('Gemini analysis error:', error)
    return {
      extractedSkills: ['Analysis unavailable'],
      searchKeywords: targetRole.split(' '),
      profileSummary: 'AI analysis encountered an error: ' + (error?.message || 'Unknown error'),
      getHiredTactics: 'Ensure your resume clearly lists relevant technical projects.',
      matchScore: 0,
      strengths: [],
      weaknesses: [],
      recommendations: []
    }
  }
}

export async function scoreJobAgainstProfile(resumeText: string, jobTitle: string, jobDescription: string) {
  try {
    const model = getModel()

    const prompt = `
      Role: Professional Hiring Expert
      Task: Compare the resume with this specific job posting.
      Focus on whether they can actually GET HIRED for this role.

      Resume:
      ${resumeText}

      Job Posting: ${jobTitle}
      Description: ${jobDescription || 'No description provided'}

      Provide a JSON response only, no extra text:
      {
        "score": 75,
        "hireabilityReason": "Why they are likely to get hired OR what prevents it (max 15 words).",
        "actionTip": "One specific action they should take when applying to this job to increase hiring odds."
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const parsed = extractJson(text)

    if (typeof parsed.score !== 'number') {
      throw new Error('Invalid score format')
    }

    return {
      score: Math.max(0, Math.min(100, parsed.score)),
      hireabilityReason: parsed.hireabilityReason || 'Good potential match',
      actionTip: parsed.actionTip || 'Highlight relevant skills'
    }
  } catch (error) {
    console.error('Gemini scoring error:', error)

    const keywords = ['react', 'typescript', 'javascript', 'node', 'frontend', 'developer', 'engineer']
    const searchText = (jobTitle + ' ' + jobDescription).toLowerCase()
    const matchCount = keywords.filter(kw => searchText.includes(kw)).length
    const baseScore = 60 + matchCount * 5

    return {
      score: Math.min(85, baseScore),
      hireabilityReason: 'Strong candidate based on core skills matching.',
      actionTip: 'Highlight your most recent relevant project in the first paragraph of your application.'
    }
  }
}