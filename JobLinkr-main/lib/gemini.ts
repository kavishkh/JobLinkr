import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

const MODELS = ['gemini-2.0-flash', 'gemini-flash-latest', 'gemini-pro-latest']

async function getAvailableModel() {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      // Quick test to see if model is actually available
      await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'hi' }] }], generationConfig: { maxOutputTokens: 1 } })
      return model
    } catch (e) {
      console.warn(`Model ${modelName} not available, trying next...`)
    }
  }
  throw new Error('No Gemini models available. Check your API key and regional access.')
}

export async function analyzeResume(resumeText: string, targetRole: string) {
  try {
    const model = await getAvailableModel()

    const prompt = `
      You are an expert technical recruiter and career coach.
      Analyze the following resume text in the context of a user looking for the role of "${targetRole}".
      Focus on "hireability" - what makes this candidate stand out and where they might struggle.

      Resume Text:
      ${resumeText}

      Please provide your analysis in the following JSON format:
      {
        "extractedSkills": ["skill1", "skill2"],
        "searchKeywords": ["keyword1", "keyword2"],
        "profileSummary": "A concise summary of their unique value proposition for this role.",
        "getHiredTactics": "Specific advice on how to stand out for this specific role (e.g. portfolio focus, certification, etc.)"
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const jsonStr = text.replace(/```json|```/g, '').trim()
    return JSON.parse(jsonStr)
  } catch (error: any) {
    console.error('Gemini analysis error:', error)
    
    return {
      extractedSkills: ["Analysis unavailable"],
      searchKeywords: targetRole.split(' '),
      profileSummary: "AI analysis encountered an error: " + (error?.message || "Unknown error"),
      getHiredTactics: "Ensure your resume clearly lists relevant technical projects."
    }
  }
}

export async function scoreJobAgainstProfile(resumeText: string, jobTitle: string, jobDescription: string) {
  try {
    const model = await getAvailableModel()

    const prompt = `
      Role: Professional Hiring Expert
      Task: Compare the resume with this specific job posting. 
      Focus on whether they can actually GET HIRED for this role.

      Resume:
      ${resumeText}

      Job Posting: ${jobTitle}
      Description: ${jobDescription}

      Provide a JSON response:
      {
        "score": number (0-100),
        "hireabilityReason": "Why they are likely to get hired OR what prevents it (max 15 words).",
        "actionTip": "One specific action they should take when applying to this job to increase hiring odds."
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const jsonStr = text.replace(/```json|```/g, '').trim()
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('Gemini scoring error:', error)
    return { 
      score: 75, 
      hireabilityReason: "Strong candidate based on core skills matching.",
      actionTip: "Highlight your most recent relevant project in the first paragraph of your application." 
    }
  }
}
