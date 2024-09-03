import { useState, useEffect } from 'react'
import { useUser } from '@/lib/UserContext'
import { useDebounce } from 'react-use'

interface UsernameFormProps {
  onSubmit: () => void
}

export default function UsernameForm({ onSubmit }: UsernameFormProps) {
  const [isAvailable, setIsAvailable] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const { username, setUsername } = useUser()
  const [debouncedUsername, setDebouncedUsername] = useState(username)

  const checkUsername = async (username: string) => {
    if (username.length < 3) return
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
      if (debouncedUsername.length >= 3) {
        checkUsername(debouncedUsername)
      }
    },
    300,
    [debouncedUsername]
  )

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value
    setUsername(newUsername)
    setDebouncedUsername(newUsername)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAvailable && username.length >= 3) {
      onSubmit()
    }
  }

  useEffect(() => {
    if (username) {
      setDebouncedUsername(username)
    }
  }, [username])

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter username"
        className={`w-full px-3 py-2 border rounded-md mb-2 ${
          !isAvailable ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-black dark:text-white theme-transition`}
        minLength={3}
        required
      />
      {isChecking && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Checking availability...</p>}
      {!isChecking && username.length >= 3 && (
        <p className={`text-sm mb-2 ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
          {isAvailable ? 'Username is available' : 'Username is taken'}
        </p>
      )}
      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-md transition-colors ${
          isAvailable && username.length >= 3
            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
        } theme-transition`}
        disabled={!isAvailable || username.length < 3}
      >
        Next
      </button>
    </form>
  )
}