import { NextRequest, NextResponse } from 'next/server'

// In-memory store for demo purposes (replace with database in production)
let postedJobs: any[] = [
  {
    id: 'ext-1',
    title: 'Senior Full-Stack Engineer',
    company: 'TechStart Inc.',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=TS',
    location: 'San Francisco, CA',
    level: 'Senior',
    type: 'Full-time',
    salary: { min: 180000, max: 240000, currency: 'USD' },
    description: 'Join our platform team building scalable infrastructure for millions of users.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 24,
    source: 'external'
  },
  {
    id: 'ext-2',
    title: 'Product Designer',
    company: 'DesignHub',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=DH',
    location: 'Austin, TX',
    level: 'Mid',
    type: 'Full-time',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    description: 'Lead the redesign of our core product.',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
    posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 18,
    source: 'external'
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const level = searchParams.get('level')
  const type = searchParams.get('type')
  const location = searchParams.get('location')

  try {
    // Try to fetch from external API (Arbeitnow)
    const externalResponse = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(q)}&page=${page}`,
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
    )
    
    let externalJobs = []
    if (externalResponse.ok) {
      const data = await externalResponse.json()
      externalJobs = data.data?.map((job: any) => ({
        id: `ext-${job.id}`,
        title: job.title,
        company: job.company_name,
        companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${job.company_name}`,
        location: job.location || 'Remote',
        level: 'Mid' as const,
        type: job.tags?.includes('Full-time') ? 'Full-time' : 'Contract',
        salary: job.salary ? { min: 0, max: 0, currency: job.currency || 'USD' } : undefined,
        description: job.description,
        skills: job.tags || [],
        posted: new Date(job.created_at).toISOString(),
        applicants: Math.floor(Math.random() * 50) + 5,
        source: 'external',
        url: job.url
      })) || []
    }

    // Combine with locally posted jobs
    let allJobs = [...externalJobs, ...postedJobs]

    // Apply filters
    if (q.trim()) {
      const lower = q.toLowerCase()
      allJobs = allJobs.filter(
        job =>
          job.title.toLowerCase().includes(lower) ||
          job.company.toLowerCase().includes(lower) ||
          job.description.toLowerCase().includes(lower) ||
          job.skills.some((s: string) => s.toLowerCase().includes(lower))
      )
    }

    if (level) {
      allJobs = allJobs.filter(job => job.level === level)
    }

    if (type) {
      allJobs = allJobs.filter(job => job.type === type)
    }

    if (location && location !== 'all') {
      allJobs = allJobs.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Sort by most recent
    allJobs.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedJobs = allJobs.slice(startIndex, endIndex)

    return NextResponse.json({
      jobs: paginatedJobs,
      total: allJobs.length,
      page,
      limit
    })
  } catch (error) {
    console.error('Job search error:', error)
    // Return local jobs if external API fails
    return NextResponse.json({
      jobs: postedJobs.slice(0, limit),
      total: postedJobs.length,
      page,
      limit
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newJob = {
      id: `job-${Date.now()}`,
      ...body,
      posted: new Date().toISOString(),
      applicants: 0,
      source: 'direct'
    }
    
    postedJobs.unshift(newJob)
    
    return NextResponse.json({ success: true, job: newJob })
  } catch (error) {
    console.error('Error posting job:', error)
    return NextResponse.json(
      { error: 'Failed to post job' },
      { status: 500 }
    )
  }
}
