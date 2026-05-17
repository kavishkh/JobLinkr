import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import dbConnect from '@/lib/mongodb'
import { EmployerProfile } from '@/lib/models/EmployerProfile'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const profile = await EmployerProfile.findOne({ userId: session.user.id })
    return NextResponse.json(profile || {})
  } catch (error: any) {
    console.error('Error fetching employer profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()

    let profile = await EmployerProfile.findOne({ userId: session.user.id })

    if (!profile) {
      profile = new EmployerProfile({
        userId: session.user.id,
        ...body
      })
    } else {
      Object.assign(profile, body)
    }

    await profile.save()

    return NextResponse.json({
      message: 'Employer profile saved successfully',
      profile
    })
  } catch (error: any) {
    console.error('Error saving employer profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
