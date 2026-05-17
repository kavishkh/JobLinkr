import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import dbConnect from '@/lib/mongodb'
import { Application } from '@/lib/models/Application'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId, fullName, phone, role, expectedPay, linkedIn, coverNote } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      jobId,
      userId: session.user.id
    })

    if (existingApplication) {
      return NextResponse.json({
        error: 'You have already applied to this job',
        application: existingApplication
      }, { status: 409 })
    }

    // Create new application with form data
    const application = new Application({
      jobId,
      userId: session.user.id,
      userEmail: session.user.email,
      fullName: fullName || session.user.name,
      phone,
      role,
      expectedPay,
      linkedIn,
      coverNote,
      status: 'Applied'
    })

    await application.save()

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
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (jobId) {
      // Get application status for a specific job
      const application = await Application.findOne({
        jobId,
        userId: session.user.id
      })

      return NextResponse.json({ application })
    } else {
      // Get all applications for the user
      const userApplications = await Application.find({
        userId: session.user.id
      })

      return NextResponse.json({ applications: userApplications })
    }

  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 })
  }
}