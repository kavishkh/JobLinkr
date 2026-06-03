import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import dbConnect from '@/lib/mongodb'
import { SavedJob } from '@/lib/models/SavedJob'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const savedJobs = await SavedJob.find({ userId: session.user.email }).sort({ createdAt: -1 })

    return NextResponse.json({ savedJobs }, { status: 200 })
  } catch (error: any) {
    console.error('Get saved jobs error:', error)
    return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId, jobTitle, company, location, salary, description } = body

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    await dbConnect()

    // Check if already saved
    const existing = await SavedJob.findOne({ userId: session.user.email, jobId })
    if (existing) {
      return NextResponse.json({ error: 'Job already saved' }, { status: 409 })
    }

    const savedJob = new SavedJob({
      userId: session.user.email,
      jobId,
      jobTitle: jobTitle || '',
      company: company || '',
      location: location || '',
      salary: salary || '',
      description: description || '',
    })

    await savedJob.save()

    return NextResponse.json({ message: 'Job saved successfully', savedJob }, { status: 201 })
  } catch (error: any) {
    console.error('Save job error:', error)
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    await dbConnect()

    await SavedJob.findOneAndDelete({ userId: session.user.email, jobId })

    return NextResponse.json({ message: 'Job removed from saved' }, { status: 200 })
  } catch (error: any) {
    console.error('Delete saved job error:', error)
    return NextResponse.json({ error: 'Failed to delete saved job' }, { status: 500 })
  }
}
