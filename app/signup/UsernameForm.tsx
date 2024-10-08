import { useState, useEffect } from 'react'
import { useUser } from '@/lib/UserContext'
import { useDebounce } from 'react-use'

interface UsernameFormProps {
  onSubmit: (username: string) => void
}

export default function UsernameForm({ onSubmit }: UsernameFormProps) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const { username, setUsername } = useUser()
  const [localUsername, setLocalUsername] = useState(username ?? '')
  const [debouncedUsername, setDebouncedUsername] = useState(localUsername)

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setIsAvailable(false)
      return
    }
    setIsChecking(true)
    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      const data = await response.json()
      setIsAvailable(!data.exists)
    } catch (error) {
      console.error('Error checking username:', error)
      setIsAvailable(false)
    } finally {
      setIsChecking(false)
    }
  }

  useDebounce(
    () => {
      checkUsername(debouncedUsername)
    },
    300,
    [debouncedUsername]
  )

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value
    setLocalUsername(newUsername)
    setDebouncedUsername(newUsername)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAvailable && localUsername.length >= 3) {
      onSubmit(localUsername)
    }
  }

  useEffect(() => {
    if (username) {
      setLocalUsername(username)
      setDebouncedUsername(username)
    }
  }, [username])

  const isButtonEnabled = isAvailable && localUsername.length >= 3 && !isChecking

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={localUsername}
        onChange={handleUsernameChange}
        placeholder="Enter username"
        className={`w-full px-3 py-2 border rounded-md mb-2 ${
          !isAvailable && localUsername.length >= 3 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-black dark:text-white theme-transition`}
        minLength={3}
        required
      />
      {isChecking && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Checking availability...</p>}
      {!isChecking && localUsername.length >= 3 && (
        <p className={`text-sm mb-2 ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
          {isAvailable ? 'Username is available' : 'Username is taken'}
        </p>
      )}
      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-md transition-colors ${
          isButtonEnabled
            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
        } theme-transition`}
        disabled={!isButtonEnabled}
      >
        Next
      </button>
    </form>
  )
}