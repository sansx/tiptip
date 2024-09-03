import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/lib/models/User'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { username, walletAddress } = await req.json()

    if (!username || !walletAddress) {
      return NextResponse.json({ error: 'Username and wallet address are required' }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters long' }, { status: 400 })
    }

    const existingUser = await User.findOne({ $or: [{ username }, { walletAddress }] })

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
      }
      if (existingUser.walletAddress === walletAddress) {
        return NextResponse.json({ error: 'Wallet address is already associated with a username' }, { status: 409 })
      }
    }

    const user = await User.create({ username, walletAddress })

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch (error) {
    console.error('Error saving username:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}