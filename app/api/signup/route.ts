import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import { User } from '../../../lib/models/User'
import { auth } from '../../../lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

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

    // Create user in Firebase
    let firebaseUid: string
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      firebaseUid = userCredential.user.uid
    } catch (firebaseError: any) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
      }
      throw firebaseError
    }

    // Also save user profile to MongoDB
    await dbConnect()
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
    }

    const newUser = new User({
      email,
      passwordHash: '', // Empty since Firebase handles password
      name,
      role,
      gender,
      age,
      headline: title,
      location,
      bio,
      socialLinks,
      skills,
      experience,
      education,
    })

    await newUser.save()

    return NextResponse.json({ message: 'User account created successfully.' }, { status: 201 })
  } catch (error: any) {
    console.error('Signup route error:', error)

    return NextResponse.json({ error: 'Could not create account.', details: error?.message ?? 'Unknown error' }, { status: 500 })
  }
}
