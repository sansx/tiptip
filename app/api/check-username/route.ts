import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/lib/models/User'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { username } = await req.json()

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return NextResponse.json({ exists: true }, { status: 200 })
    } else {
      return NextResponse.json({ exists: false }, { status: 200 })
    }
  } catch (error) {
    console.error('Error checking username:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}