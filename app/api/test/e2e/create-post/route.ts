import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'E2E create-post endpoint removed' }, { status: 404 })
}
