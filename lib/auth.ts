import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function generateToken(payload: { email?: string; address: string; username?: string }): Promise<string> {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) reject(err);
      else resolve(token as string);
    });
  });
}

export async function verifyToken(stoken: string) {
  try {
    const response = await fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stoken }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export async function logout() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to logout')
    }

    return await response.json()
  } catch (error) {
    console.error('Error logging out:', error)
    throw new Error('Failed to logout')
  }
}