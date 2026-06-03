import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json().catch(() => ({}))
    const content = (body.content || '').toString().trim()
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const postRef = doc(db, 'posts', id)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const postData = postSnap.data()
    const comments = (postData.comments || 0) + 1

    await updateDoc(postRef, { comments })

    return NextResponse.json({ 
      message: 'Comment added', 
      post: { id, ...postData, comments } 
    })
  } catch (error: any) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}

