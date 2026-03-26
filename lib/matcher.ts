import { Job, mockJobs } from './mockData'

export interface MatchResult {
  job: Job
  score: number
  reason: string
}

export function matchJobsWithResume(
  resumeText: string,
  targetRole: string,
  preferredType: string,
  preferredLevel: string
): MatchResult[] {
  const normalizedRole = targetRole.toLowerCase()
  const normalizedResume = resumeText.toLowerCase()

  const results = mockJobs.map((job) => {
    let score = 0
    let reasons: string[] = []

    // 1. Role Match (Highest priority)
    const jobTitle = job.title.toLowerCase()
    if (jobTitle.includes(normalizedRole)) {
      score += 40
      reasons.push(`Perfect title match for "${targetRole}"`)
    } else {
      // Partial match for title
      const roleWords = normalizedRole.split(' ')
      const matchingWords = roleWords.filter(word => jobTitle.includes(word))
      if (matchingWords.length > 0) {
        score += 20
        reasons.push(`Strong overlap with your target role`)
      }
    }

    // 2. Skill Match
    const matchingSkills = job.skills.filter(skill => 
      normalizedResume.includes(skill.toLowerCase()) || 
      normalizedRole.includes(skill.toLowerCase())
    )
    
    if (matchingSkills.length > 0) {
      const skillScore = Math.min(30, matchingSkills.length * 10)
      score += skillScore
      reasons.push(`Matches your skills: ${matchingSkills.join(', ')}`)
    }

    // 3. Job Type Match
    if (job.type === preferredType) {
      score += 15
      reasons.push(`Matches your preferred job type (${preferredType})`)
    }

    // 4. Level Match
    if (job.level === preferredLevel) {
      score += 15
      reasons.push(`Aligned with your experience level (${preferredLevel})`)
    }

    // Base score variability
    score += Math.floor(Math.random() * 5)

    // Final normalization
    const finalScore = Math.min(100, Math.max(0, score))

    return {
      job,
      score: finalScore,
      reason: reasons.length > 0 ? reasons[0] : "Good overall alignment with your profile",
    }
  })

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score)
}
