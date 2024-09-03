'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthenticationStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextType {
  authenticationStatus: AuthenticationStatus
  setAuthenticationStatus: (status: AuthenticationStatus) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticationStatus, setAuthenticationStatus] = useState<AuthenticationStatus>('unauthenticated')

  return (
    <AuthContext.Provider value={{ authenticationStatus, setAuthenticationStatus }}>
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