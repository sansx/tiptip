'use client'

import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from 'wagmi'
import { useAuth } from '@/lib/AuthContext'
import { CustomConnectButton } from './components/CustomConnectButton'

export default function Home() {
  const { isConnected } = useAccount()
  const { authenticationStatus } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isConnected && authenticationStatus === 'authenticated') {
      router.push('/signup')
    }
  }, [isConnected, authenticationStatus, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-light-bg dark:bg-gray-900 text-black dark:text-white">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">TipTip: Web3 Creator Support</h1>
        <p className="text-base sm:text-lg mb-8">
          Empower creators with decentralized tipping. Connect your wallet and start supporting your favorite content makers!
        </p>
        <CustomConnectButton 
          connectText="Start My TipTip 🍻"
          connectedText="My TipTip Account"
          unsupportedNetworkText="Switch to TipTip Network"
        />
      </div>
      <div className="mt-12">
        {/* <Image src="/coffee.png" alt="TipTip Logo" width={200} height={200} className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64" /> */}
      </div>
      <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        Powered by blockchain technology. Secure, transparent, and decentralized.
      </p>
    </main>
  )
}
