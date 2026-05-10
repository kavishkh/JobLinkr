import { NextResponse } from 'next/server'
import { auth, db } from '../../../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore/lite'

interface SignupRequestBody {
  name: string
  email: string
  password: string
  role: 'Seeker' | 'Employer'
  gender: 'male' | 'female'
  age: number
  title?: string
  location?: string
  bio?: string
  socialLinks?: {
    linkedin?: string
    github?: string
    portfolio?: string
    twitter?: string
  }
  skills?: Array<{ name: string; level: string }>
  experience?: Array<{ company: string; title: string; period: string; description: string }>
  education?: Array<{ school: string; degree: string; year: string }>
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length > 0 ? email : null
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupRequestBody

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = normalizeEmail(body.email)
    const password = typeof body.password === 'string' ? body.password : ''
    const role = body.role
    const gender = body.gender
    const age = Number(body.age)
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const location = typeof body.location === 'string' ? body.location.trim() : ''
    const bio = typeof body.bio === 'string' ? body.bio.trim() : ''
    const socialLinks = body.socialLinks ?? {}
    const skills = Array.isArray(body.skills) ? body.skills : []
    const experience = Array.isArray(body.experience) ? body.experience : []
    const education = Array.isArray(body.education) ? body.education : []

    if (!name || !email || !password || !role || !gender || !Number.isInteger(age)) {
      return NextResponse.json({ error: 'Missing required signup fields.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 })
    }

    if (role !== 'Seeker' && role !== 'Employer') {
      return NextResponse.json({ error: 'Invalid role.', details: 'Role must be Seeker or Employer.' }, { status: 400 })
    }

    if (gender !== 'male' && gender !== 'female') {
      return NextResponse.json({ error: 'Invalid gender value.', details: 'Gender must be male or female.' }, { status: 400 })
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user
    const displayName = `${name}|${role}`

    try {
      await updateProfile(firebaseUser, { displayName })
    } catch (profileError: any) {
      console.warn('Failed to save displayName on Firebase Auth user:', profileError)
    }

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      await setDoc(userDocRef, {
        id: firebaseUser.uid,
        name,
        email,
        role,
        gender,
        age,
        title,
        location,
        bio,
        socialLinks,
        skills,
        experience,
        education,
        createdAt: new Date().toISOString(),
      })
    } catch (firestoreError: any) {
      console.warn('Failed to write user profile to Firestore:', firestoreError)
    }

    return NextResponse.json({ message: 'User account created successfully.' }, { status: 201 })
  } catch (error: any) {
    console.error('Signup route error:', error)

    if (error?.code === 'auth/email-already-in-use') {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
    }

    if (error?.code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    if (error?.code === 'auth/weak-password') {
      return NextResponse.json({ error: 'Password is too weak.' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Could not create account.', details: error?.message ?? 'Unknown error' }, { status: 500 })
  }
}
