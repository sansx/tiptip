import { useState, useEffect } from 'react'
import { useUser } from '@/lib/UserContext'
import { useDebounce } from 'react-use'

interface EmailFormProps {
  onSubmit: () => void
}

export default function EmailForm({ onSubmit }: EmailFormProps) {
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [error, setError] = useState('')
  const { email, setEmail } = useUser()
  const [debouncedEmail, setDebouncedEmail] = useState(email)

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  useDebounce(
    () => {
      const isValid = validateEmail(debouncedEmail)
      setIsValidEmail(isValid)
      if (!isValid && debouncedEmail !== '') {
        setError('Please enter a valid email address')
      } else {
        setError('')
      }
    },
    300,
    [debouncedEmail]
  )

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setDebouncedEmail(newEmail)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail) {
      onSubmit()
    } else {
      setError('Please enter a valid email address')
    }
  }

  useEffect(() => {
    if (email) {
      setDebouncedEmail(email)
    }
  }, [email])

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter email"
        className={`w-full px-3 py-2 border rounded-md mb-2 ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-black dark:text-white`}
        required
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-md transition-colors ${
          isValidEmail
            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
        }`}
        disabled={!isValidEmail}
      >
        Send Verification Email
      </button>
    </form>
  )
}