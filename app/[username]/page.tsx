'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/UserContext'
import { logout } from '@/lib/auth'
import { ConnectButton } from '@rainbow-me/rainbowkit'
// 如果您使用的是自定义钱包按钮，请相应地更改导入
// import { CustomWalletButton } from '@/components/CustomWalletButton'

export default function UserProfile({ params }: { params: { username: string } }) {
  const router = useRouter()
  const { user, setUser } = useUser()

  useEffect(() => {
    if (!user || user.username !== params.username) {
      router.push('/')
    }
  }, [user, params.username, router])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-light-bg dark:bg-gray-900 text-black dark:text-white">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Username</label>
            <p className="mt-1 text-lg font-semibold">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
            <p className="mt-1 text-lg">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Wallet Addresses</label>
            {user.walletAddresses.map((address, index) => (
              <p key={index} className="mt-1 text-lg break-all">{address}</p>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-4 flex flex-col items-center">
          <ConnectButton />
          {/* 如果使用自定义钱包按钮，请使用下面的行替换上面的 ConnectButton */}
          {/* <CustomWalletButton /> */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}