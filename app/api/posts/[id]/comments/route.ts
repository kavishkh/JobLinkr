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
    const body = await request.json().catch(() => ({}))
    const content = (body.content || '').toString().trim()
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const post = await Post.findById(id)
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    // Increment comment count. For a full implementation, store comment documents.
    post.comments = (post.comments || 0) + 1
    await post.save()

    return NextResponse.json({ message: 'Comment added', post })
  } catch (error: any) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
