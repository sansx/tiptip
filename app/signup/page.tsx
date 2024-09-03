'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useUser } from '@/lib/UserContext'
import { useWalletConnected } from '@/lib/hooks/useWalletConnected'
import UsernameForm from './UsernameForm'
import EmailForm from './EmailForm'

export default function Signup() {
  const [step, setStep] = useState<'username' | 'email'>('username')
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const { username, email } = useUser()
  const isConnectedAndAuthenticated = useWalletConnected()

  useEffect(() => {
    if (!isConnectedAndAuthenticated) {
      router.push('/')
    }
  }, [isConnectedAndAuthenticated, router])

  const handleUsernameSubmit = () => {
    setStep('email')
  }

  const handleEmailSubmit = async () => {
    try {
      // Here you would call your existing email sending function
      // For example:
      // await sendVerificationEmail(email)
      router.push('/email-sent')
    } catch (error) {
      console.error('Error sending email:', error)
      // 可以在这里添加错误处理逻辑，比如显示一个通知
    }
  }

  const handleReturn = () => {
    setStep('username')
  }

  const handleDisconnect = () => {
    disconnect()
    router.push('/')
  }

  if (!isConnectedAndAuthenticated) return null

  const getStepTitle = () => {
    switch (step) {
      case 'username':
        return 'Choose Your Username'
      case 'email':
        return 'Enter Your Email'
      default:
        return 'Sign Up'
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-6 pt-12 sm:p-12 sm:pt-24 bg-light-bg dark:bg-gray-900 text-black dark:text-white theme-transition">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">{getStepTitle()}</h1>
      
      <div className="w-full max-w-xs">
        {step === 'username' ? (
          <UsernameForm onSubmit={handleUsernameSubmit} />
        ) : (
          <EmailForm onSubmit={handleEmailSubmit} />
        )}
      </div>
      
      <div className="flex w-full max-w-xs mt-4 space-x-4">
        {step === 'email' && (
          <button
            onClick={handleReturn}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors theme-transition"
          >
            Back
          </button>
        )}
        <button
          onClick={handleDisconnect}
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors theme-transition"
        >
          Disconnect
        </button>
      </div>
      
      <div className="mt-8">
        <ConnectButton />
      </div>
    </div>
  )
}
