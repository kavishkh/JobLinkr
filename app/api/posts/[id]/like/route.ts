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
    const postRef = doc(db, 'posts', id)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const postData = postSnap.data()
    
    // Toggle like
    let likes = postData.likes || 0
    let liked = postData.liked || false

    if (liked) {
      likes = Math.max(0, likes - 1)
      liked = false
    } else {
      likes += 1
      liked = true
    }

    await updateDoc(postRef, { likes, liked })

    return NextResponse.json({ 
      message: 'Toggled like', 
      post: { id, ...postData, likes, liked } 
    })
  } catch (error: any) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}

