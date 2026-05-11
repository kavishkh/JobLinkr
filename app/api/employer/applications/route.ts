import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { mockJobs } from '@/lib/mockData'

// Import applications from the apply route (in a real app, this would be in a database)
import { applications } from '../../jobs/apply/route'

export async function GET(request: Request) {
  try {
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

    let employerApplications = applications

    // Filter applications for specific job if jobId is provided
    if (jobId) {
      employerApplications = applications.filter(app => app.jobId === jobId)
    }

    // In a real app, you would also filter by the employer's jobs
    // For now, return all applications (since we don't have job ownership tracking)

    // Add user information and job information to applications
    const applicationsWithDetails = employerApplications.map(app => {
      const job = mockJobs.find(j => j.id === app.jobId)
      return {
        ...app,
        applicantName: `User ${app.userId.slice(-4)}`, // Mock name - in real app, fetch from users table
        applicantEmail: `user${app.userId.slice(-4)}@example.com`, // Mock email
        position: job?.title || 'Unknown Position',
        company: job?.company || 'Unknown Company',
      }
    })

    return NextResponse.json({
      applications: applicationsWithDetails,
      total: applicationsWithDetails.length
    })

  } catch (error) {
    console.error('Get employer applications error:', error)
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 })
  }
}