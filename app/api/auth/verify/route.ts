import { NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { getUserByWalletAddress } from '@/lib/db'

export async function POST(request: Request) {
  const { message, signature } = await request.json()

  try {
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)

    // 检查用户是否存在
    const user = await getUserByWalletAddress(fields.address)

    if (user) {
      return NextResponse.json({ exists: true, username: user.username })
    } else {
      return NextResponse.json({ exists: false })
    }
  } catch (error) {
    console.error('Error verifying signature:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
}