'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/lib/UserContext'
import { verifyToken } from '@/lib/auth'

export default function TokenVerifier() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setIsLoading } = useUser()

  useEffect(() => {
    const stoken = searchParams?.get('stoken')
    if (stoken) {
      setIsLoading?.(true)
      verifyToken?.(stoken)
        .then(userData => {
          if (userData) {
            setUser?.(userData)
            router?.push?.(`/${userData.username}`)
          } else {
            console.error('No user data returned from verifyToken')
            router?.push?.('/login')
          }
        })
        .catch(error => {
          console.error('Token verification failed:', error)
          router?.push?.('/login')
        })
        .finally(() => {
          setIsLoading?.(false)
        })
    }
  }, [searchParams, router, setUser, setIsLoading])

  return null
}