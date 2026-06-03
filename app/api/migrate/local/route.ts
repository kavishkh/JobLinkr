import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore/lite'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { posts, savedJobs } = body || {}

    const results: any = { posts: 0, savedJobs: 0 }
    const userId = session.user.id

    // Migrate posts
    if (Array.isArray(posts) && posts.length > 0) {
      const author = { 
        id: userId, 
        name: session.user.name || 'Anonymous', 
        avatar: (session.user as any).image || '', 
        role: (session.user as any).role || 'Seeker' 
      }
      
      for (const p of posts) {
        try {
          if (!p || !p.content) continue
          
          // Check if exists (simple check by content and userId)
          const postsCol = collection(db, 'posts')
          const q = query(postsCol, where('content', '==', String(p.content).trim()), where('userId', '==', userId))
          const snapshot = await getDocs(q)
          if (!snapshot.empty) continue

          const docData: any = {
            userId,
            author,
            content: String(p.content).trim(),
            likes: Number(p.likes) || 0,
            comments: Number(p.comments) || 0,
            shares: Number(p.shares) || 0,
            liked: !!p.liked,
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date()
          }
          
          await addDoc(postsCol, docData)
          results.posts++
        } catch (e) {
          console.warn('Failed to migrate post', e)
        }
      }
    }

    // Migrate saved jobs
    if (Array.isArray(savedJobs) && savedJobs.length > 0) {
      for (const sj of savedJobs) {
        try {
          const jobId = sj.id || sj.jobId
          if (!jobId) continue
          
          const savedJobsCol = collection(db, 'savedJobs')
          const q = query(savedJobsCol, where('userId', '==', userId), where('jobId', '==', jobId))
          const snapshot = await getDocs(q)
          if (!snapshot.empty) continue

          await addDoc(savedJobsCol, { userId, jobId, createdAt: new Date() })
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

