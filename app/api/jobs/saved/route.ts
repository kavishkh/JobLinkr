import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import dbConnect from '@/lib/mongodb'
import { SavedJob } from '@/lib/models/SavedJob'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const savedJobs = await SavedJob.find({ userId: session.user.id })
    const jobIds = savedJobs.map(job => job.jobId)

    return NextResponse.json({
      jobs: savedJobs,
      jobIds
    })
  } catch (error: any) {
    console.error('Error fetching saved jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Check if already saved
    let saved = await SavedJob.findOne({ userId: session.user.id, jobId })
    
    if (saved) {
      // If already saved, remove it (toggle behavior)
      await SavedJob.findByIdAndDelete(saved._id)
      return NextResponse.json({
        message: 'Job removed from saved list',
        saved: false
      })
    }

    // Create new saved job
    saved = new SavedJob({
      userId: session.user.id,
      jobId
    })

    await saved.save()

    return NextResponse.json({
      message: 'Job saved successfully',
      saved: true
    })
  } catch (error: any) {
    console.error('Error saving job:', error)
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    await SavedJob.findOneAndDelete({ userId: session.user.id, jobId })

    return NextResponse.json({
      message: 'Job removed from saved list'
    })
  } catch (error: any) {
    console.error('Error removing saved job:', error)
    return NextResponse.json({ error: 'Failed to remove job' }, { status: 500 })
  }
}
