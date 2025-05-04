import { useState } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null
  })

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error
  }
} 