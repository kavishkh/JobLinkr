import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { mockJobs } from '@/lib/mockData'
import dbConnect from '@/lib/mongodb'
import { Application } from '@/lib/models/Application'
import { User } from '@/lib/models/User'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user is an employer (in a real app, this would be checked from the database)
    if (session.user.role !== 'Employer') {
      return NextResponse.json({ error: 'Employer access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    let query: any = {}
    if (jobId) {
      query.jobId = jobId
    }

    const applications = await Application.find(query)

    // Add user information to applications
    const applicationsWithDetails = await Promise.all(
      applications.map(async (app) => {
        const user = await User.findById(app.userId).select('-passwordHash')
        const job = mockJobs.find(j => j.id === app.jobId)
        return {
          ...app.toObject(),
          applicantName: user?.name || `User ${app.userId.slice(-4)}`,
          applicantEmail: user?.email || app.userEmail,
          position: job?.title || 'Unknown Position',
          company: job?.company || 'Unknown Company',
        }
      })
    )

    return NextResponse.json({
      applications: applicationsWithDetails,
      total: applicationsWithDetails.length
    })

  } catch (error) {
    console.error('Get employer applications error:', error)
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 })
  }
}