import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore/lite'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')

    const postsCol = collection(db, 'posts')
    const q = query(postsCol, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const allPosts = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
      }
    })

    // Manual pagination due to firestore lite limitations with offset
    const posts = allPosts.slice(skip, skip + limit)
    const total = allPosts.length

    return NextResponse.json({
      posts,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const postsCol = collection(db, 'posts')
    
    const postData = {
      userId: session.user.id,
      author: {
        id: session.user.id,
        name: session.user.name || 'Anonymous',
        avatar: (session.user as any).picture || '',
        role: (session.user as any).role || 'Seeker'
      },
      content: content.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(postsCol, postData)

    return NextResponse.json({
      message: 'Post created successfully',
      post: { id: docRef.id, ...postData }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

