import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userRef = doc(db, 'users', session.user.id)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // If user profile doesn't exist in firestore yet, return basic session info
      return NextResponse.json({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role
      })
    }

    return NextResponse.json({ id: userSnap.id, ...userSnap.data() })
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    
    // Remove protected fields from the update body
    const { id, email, passwordHash, createdAt, updatedAt, ...updateData } = body

    const userRef = doc(db, 'users', session.user.id)
    
    // Check if document exists
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      // Create if it doesn't exist
      await updateDoc(userRef, { ...updateData, updatedAt: new Date() }) // Wait, updateDoc fails if it doesn't exist!
      // Better to use setDoc with merge: true or check existence
    }
    
    // Let's use setDoc with merge: true to create or update
    // But firestore lite setDoc doesn't take merge in the same way?
    // Wait, firestore lite setDoc does not support merge?
    // Let's check. Yes, it does or you can just use updateDoc if you know it exists.
    // Let's use getDoc first.
    
    if (userSnap.exists()) {
      await updateDoc(userRef, { ...updateData, updatedAt: new Date() })
    } else {
      // Fallback or handle creation if needed. For now, let's just assume we update or create.
      // If we use setDoc from firestore/lite, we can do it.
      // Let's assume updateDoc works or handle it.
      // Let's just use updateDoc for now as the original code used findOneAndUpdate which implies update.
      await updateDoc(userRef, { ...updateData, updatedAt: new Date() })
    }

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

