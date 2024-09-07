'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from '@/lib/AuthContext'
import { CustomConnectButton } from './components/CustomConnectButton'
import { useRouter } from 'next/navigation'
import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { generateToken } from '@/lib/auth'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { authenticationStatus, setUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { signMessageAsync } = useSignMessage()
  const [checkCompleted, setCheckCompleted] = useState(false)

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (isConnected && authenticationStatus === 'authenticated' && address && !checkCompleted) {
        setLoading(true)
        try {
          // 1. 获取 nonce
          const nonceResponse = await fetch('/api/auth/nonce')
          const nonce = await nonceResponse.text()

          // 2. 创建 SIWE 消息
          const message = new SiweMessage({
            domain: window.location.host,
            address: address,
            statement: 'Sign in with Ethereum to TipTip',
            uri: window.location.origin,
            version: '1',
            chainId: 1,
            nonce: nonce.replaceAll('"', '')
          })

          // 3. 签名消息
          const signature = await signMessageAsync({
            message: message.prepareMessage(),
          })

          // 4. 验证签名并检查用户是否存在
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, signature }),
          })

          if (!response.ok) {
            throw new Error('Failed to verify signature')
          }

          const { exists, username } = await response.json()

          if (exists) {
            // 5. 如果用户存在，生成令牌并重定向到用户资料页面
            const token = await generateToken({ address, username })
            localStorage.setItem('auth_token', token)
            setUser({ username, address }) // 这里使用 setUser
            router.push(`/${username}`)
          } else {
            // 6. 如果用户不存在，重定向到注册页面
            router.push('/signup')
          }
        } catch (error) {
          console.error('Error during user check:', error)
          // 如果发生错误，仍然重定向到注册页面
          router.push('/signup')
        } finally {
          setLoading(false)
          setCheckCompleted(true)
        }
      }
    }

    checkUserAndRedirect()
  }, [isConnected, authenticationStatus, address, router, signMessageAsync, checkCompleted, setUser])

  if (loading) {
    return <div>Loading...</div>
  }

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
