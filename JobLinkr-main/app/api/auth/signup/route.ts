import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/lib/password'
import { createUser } from '@/lib/user-store'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['Seeker', 'Employer']),
  gender: z.enum(['male', 'female']),
  age: z.coerce.number().int().min(13).max(100),
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

  const { name, email, password, role, gender, age } = parsed.data
  // Use gender + age to generate a distinct avatar per user.
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(`${email}|${gender}|${age}`)}&gender=${gender}&age=${age}`

  try {
    const user = await createUser({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      passwordHash: hashPassword(password),
      role,
      gender,
      age,
      avatar,
    })
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
  } catch (e) {
    if (e instanceof Error && e.message === 'EMAIL_TAKEN') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }
    console.error(e)
    return NextResponse.json({ error: 'Could not create account' }, { status: 500 })
  }
}
