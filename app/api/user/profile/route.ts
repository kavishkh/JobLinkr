import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, limit } from 'firebase/firestore'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", session.user.email), limit(1))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = querySnapshot.docs[0].data()
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
