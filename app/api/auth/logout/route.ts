import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // 清除认证相关的 cookie
    cookies().delete('auth_token')
    
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 })
  }
}