import { NextRequest, NextResponse } from 'next/server'

// In-memory store for applications (replace with database in production)
let applications: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const application = {
      id: `app-${Date.now()}`,
      jobId: body.jobId,
      userId: body.userId || 'current-user', // In real app, get from session
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      coverLetter: body.coverLetter || '',
      resume: body.resume || null,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      linkedin: body.linkedin,
      portfolio: body.portfolio,
      yearsOfExperience: body.yearsOfExperience,
      skills: body.skills || [],
      availability: body.availability || 'Immediately'
    }
    
    applications.push(application)
    
    // In a real app, you would:
    // 1. Send email notification to employer
    // 2. Update job applicant count
    // 3. Save resume to cloud storage
    
    console.log('Application submitted:', application)
    
    return NextResponse.json({ 
      success: true, 
      application,
      message: 'Application submitted successfully!'
    })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const userId = searchParams.get('userId')
    
    let filteredApplications = applications
    
    if (jobId) {
      filteredApplications = filteredApplications.filter(app => app.jobId === jobId)
    }
    
    if (userId) {
      filteredApplications = filteredApplications.filter(app => app.userId === userId)
    }
    
    return NextResponse.json({ applications: filteredApplications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
