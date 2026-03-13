import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Job from '@/lib/models/Job'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10
  const skip = (page - 1) * limit

  try {
    await dbConnect()

    const query = q 
      ? { 
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { company_name: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ] 
        } 
      : {}

    const [jobs, total] = await Promise.all([
      Job.find(query).skip(skip).limit(limit).sort({ published_at: -1 }),
      Job.countDocuments(query)
    ])

    return NextResponse.json({
      data: jobs,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Job search database error:', error)
    return NextResponse.json({ error: 'Failed to search jobs from database' }, { status: 500 })
  }
}
