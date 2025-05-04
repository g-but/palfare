import { useState, useEffect } from 'react'
import { User, UserFormData, UseUserReturn, BitcoinData } from './types'
import { updateUser, fetchUserBitcoinData } from './service'

export function useUsers(): { users: User[] | null; loading: boolean; error: string | null } {
  const [users, setUsers] = useState<User[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        // TODO: Implement actual API call
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        
        const usersData = await response.json()
        setUsers(usersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading, error }
}

export function useUser(userId: string): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Implement actual API call
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      
      const userData = await response.json()
      setUser(userData)

      // Fetch Bitcoin data if address exists
      if (userData.bitcoin_address) {
        const btcData = await fetchUserBitcoinData(userData.bitcoin_address)
        setBitcoinData(btcData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [userId])

  return {
    user,
    bitcoinData,
    loading,
    error,
    update: async (data: UserFormData) => {
      const result = await updateUser(userId, data)
      if (result.success && result.user) {
        setUser(result.user)
        if (result.user.bitcoin_address) {
          const btcData = await fetchUserBitcoinData(result.user.bitcoin_address)
          setBitcoinData(btcData)
        }
      }
      return result
    },
    refresh
  }
} 