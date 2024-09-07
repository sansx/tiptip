import { NextResponse } from 'next/server'
import { getUserByStoken } from '@/lib/db'

export async function POST(request: Request) {
  const { stoken } = await request.json()

  if (!stoken || typeof stoken !== 'string') {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 })
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const user = await getUserByStoken(stoken)
    
    if (user && user._id) {
      return NextResponse.json({
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        walletAddresses: user.walletAddresses
      })
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ message: 'Error verifying token' }, { status: 500 })
  }
}