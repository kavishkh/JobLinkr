import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import dbConnect from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = params
    const post = await Post.findById(id)
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    // Toggle like (simple toggle stored on post)
    if (post.liked) {
      post.likes = Math.max(0, (post.likes || 0) - 1)
      post.liked = false
    } else {
      post.likes = (post.likes || 0) + 1
      post.liked = true
    }

    await post.save()

    return NextResponse.json({ message: 'Toggled like', post })
  } catch (error: any) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
