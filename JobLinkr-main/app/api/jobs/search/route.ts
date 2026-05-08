import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'

  try {
    // Some unofficial sources suggest 'search' or 'q' might work
    const response = await fetch(`https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(q)}&page=${page}`)
    if (!response.ok) {
      throw new Error('Failed to fetch from Arbeitnow')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Job search error:', error)
    return NextResponse.json({ error: 'Failed to search jobs' }, { status: 500 })
  }
}
