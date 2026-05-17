import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import dbConnect from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { SavedJob } from '@/lib/models/SavedJob'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { posts, savedJobs } = body || {}

    const results: any = { posts: 0, savedJobs: 0 }

    // Migrate posts
    if (Array.isArray(posts) && posts.length > 0) {
      const userId = session.user.id
      const author = { id: userId, name: session.user.name || 'Anonymous', avatar: (session.user as any).image || '', role: (session.user as any).role || 'Seeker' }
      for (const p of posts) {
        try {
          if (!p || !p.content) continue
          const exists = await Post.findOne({ content: p.content, userId, createdAt: p.createdAt ? new Date(p.createdAt) : undefined })
          if (exists) continue
          const doc: any = {
            userId,
            author,
            content: String(p.content).trim(),
            likes: Number(p.likes) || 0,
            comments: Number(p.comments) || 0,
            shares: Number(p.shares) || 0,
            liked: !!p.liked
          }
          const created = new Post(doc)
          await created.save()
          results.posts++
        } catch (e) {
          console.warn('Failed to migrate post', e)
        }
      }
    }

    // Migrate saved jobs
    if (Array.isArray(savedJobs) && savedJobs.length > 0) {
      const userId = session.user.id
      for (const sj of savedJobs) {
        try {
          const jobId = sj.id || sj.jobId
          if (!jobId) continue
          const exists = await SavedJob.findOne({ userId, jobId })
          if (exists) continue
          const doc = new SavedJob({ userId, jobId })
          await doc.save()
          results.savedJobs++
        } catch (e) {
          console.warn('Failed to migrate saved job', e)
        }
      }
    }

    return NextResponse.json({ message: 'Migration complete', results })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Migration failed', details: error?.message }, { status: 500 })
  }
}
