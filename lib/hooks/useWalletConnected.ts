import { useAccount } from 'wagmi'
import { useAuth } from '@/lib/AuthContext'

export function useWalletConnected() {
  const { isConnected } = useAccount()
  const { authenticationStatus } = useAuth()

  return isConnected && authenticationStatus === 'authenticated'
}