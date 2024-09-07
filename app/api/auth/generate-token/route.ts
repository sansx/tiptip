import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: Request) {
  const { payload } = await request.json()

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
  }

  if (!JWT_SECRET) {
    return NextResponse.json({ message: 'JWT_SECRET is not defined' }, { status: 500 })
  }

  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
    return NextResponse.json({ token })
  } catch (error) {
    console.error('Error generating token:', error)
    return NextResponse.json({ message: 'Error generating token' }, { status: 500 })
  }
}