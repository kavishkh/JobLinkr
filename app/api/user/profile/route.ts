import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, limit } from 'firebase/firestore/lite'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    /*
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", session.user.email), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = querySnapshot.docs[0].data()
    return NextResponse.json(user)
    */

    // Return temporary profile since Firestore is disabled
    return NextResponse.json({
      name: session.user.name || 'Professional User',
      email: session.user.email,
      role: (session.user as any).role || 'Seeker',
      bio: 'Firestore is currently disabled. Update your settings to enable profile storage.',
      skills: [],
      experience: [],
      education: [],
    })
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", session.user.email), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userDoc = querySnapshot.docs[0]
    const userRef = doc(db, "users", userDoc.id)

    // Remove protected fields from the update body
    const { id, email, password, createdAt, updatedAt, ...updateData } = body

    await updateDoc(userRef, JSON.parse(JSON.stringify({
      ...updateData,
      updatedAt: new Date().toISOString()
    })))

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
