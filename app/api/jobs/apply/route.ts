import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

// In a real app, this would be stored in a database
export let applications: Array<{
  id: string
  jobId: string
  userId: string
  status: 'Applied' | 'Under Review' | 'Rejected' | 'Accepted'
  appliedAt: Date
}> = []

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Check if user has already applied to this job
    const existingApplication = applications.find(
      app => app.jobId === jobId && app.userId === session.user.id
    )

    if (existingApplication) {
      return NextResponse.json({
        error: 'You have already applied to this job',
        application: existingApplication
      }, { status: 409 })
    }

    // Create new application
    const application = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      jobId,
      userId: session.user.id,
      status: 'Applied' as const,
      appliedAt: new Date()
    }

    applications.push(application)

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application
    })

  } catch (error) {
    console.error('Job application error:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (jobId) {
      // Get application status for a specific job
      const application = applications.find(
        app => app.jobId === jobId && app.userId === session.user.id
      )

      return NextResponse.json({ application })
    } else {
      // Get all applications for the user
      const userApplications = applications.filter(
        app => app.userId === session.user.id
      )

      return NextResponse.json({ applications: userApplications })
    }

  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 })
  }
}