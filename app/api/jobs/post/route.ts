import { NextRequest, NextResponse } from 'next/server'

// In-memory store for jobs (replace with database in production)
let postedJobs: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'level', 'type', 'description', 'skills']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    const newJob = {
      id: `job-${Date.now()}`,
      title: body.title,
      company: body.company,
      companyLogo: body.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${body.company}`,
      location: body.location,
      level: body.level, // Entry, Mid, Senior
      type: body.type, // Full-time, Contract, Freelance
      salary: body.salary || undefined,
      description: body.description,
      skills: body.skills,
      posted: new Date().toISOString(),
      applicants: 0,
      source: 'direct',
      employerId: body.employerId || 'current-employer',
      requirements: body.requirements || [],
      benefits: body.benefits || [],
      applicationDeadline: body.applicationDeadline || null,
      remote: body.remote || false,
      visaSponsorship: body.visaSponsorship || false
    }
    
    postedJobs.unshift(newJob)
    
    console.log('New job posted:', newJob)
    
    return NextResponse.json({ 
      success: true, 
      job: newJob,
      message: 'Job posted successfully!'
    })
  } catch (error) {
    console.error('Error posting job:', error)
    return NextResponse.json(
      { error: 'Failed to post job' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({ jobs: postedJobs })
  } catch (error) {
    console.error('Error fetching posted jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posted jobs' },
      { status: 500 }
    )
  }
}
