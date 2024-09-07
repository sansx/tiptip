'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  username: string
  address: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  authenticationStatus: 'authenticated' | 'unauthenticated' | 'loading'
  setAuthenticationStatus: (status: 'authenticated' | 'unauthenticated' | 'loading') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authenticationStatus, setAuthenticationStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('unauthenticated')

  return (
    <AuthContext.Provider value={{ user, setUser, authenticationStatus, setAuthenticationStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}