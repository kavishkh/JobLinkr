import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/lib/password'
import { collection, doc, setDoc } from 'firebase/firestore/lite'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['Seeker', 'Employer']),
  gender: z.enum(['male', 'female']),
  age: z.coerce.number().int().min(13).max(100),
  bio: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  skills: z.array(z.object({
    name: z.string(),
    level: z.string(),
  })).optional(),
  experience: z.array(z.object({
    company: z.string(),
    title: z.string(),
    period: z.string(),
    description: z.string(),
  })).optional(),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    year: z.string(),
  })).optional(),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors
    const first =
      Object.values(msg).flat()[0] ?? 'Invalid input'
    return NextResponse.json({ error: first }, { status: 400 })
  }

  const { 
    name, email, password, role, gender, age, 
    bio, location, title, socialLinks, skills, experience, education 
  } = parsed.data
  // Use gender + age to generate a distinct avatar per user.
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(`${email}|${gender}|${age}`)}&gender=${gender}&age=${age}`

  try {
    // 1. Create user in Firebase Authentication
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      // Update the user's profile with their name immediately
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });
      }
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }
      throw authError;
    }

    const firebaseUser = userCredential.user;

    // NOTE: Firestore storage is disabled per user request
    /*
    const userData = JSON.parse(JSON.stringify({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: name.trim(),
      role: role,
      image: avatar,
      gender,
      age,
      bio: bio || null,
      location: location || null,
      title: title || null,
      socialLinks: socialLinks || {},
      skills: skills || [],
      experience: experience || [],
      education: education || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    const userDocRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userDocRef, userData);
    */

    return NextResponse.json({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: name.trim(),
      role: role,
    })
  } catch (e: any) {
    console.error('Signup error details:', e)
    return NextResponse.json({ 
      error: 'Could not create account', 
      details: e.message || 'Unknown error',
      code: e.code || 'no-code'
    }, { status: 500 })
  }
}
