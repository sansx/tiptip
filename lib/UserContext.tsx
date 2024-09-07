'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  username: string
  walletAddresses: string[]
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsLoading: (isLoading: boolean) => void
  username: string | null
  setUsername: (username: string) => void
  email: string | null
  setEmail: (email: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, setIsLoading, username, setUsername, email, setEmail }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}