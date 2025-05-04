import { User } from '../profile/types'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, display_name: string) => Promise<void>
  signOut: () => Promise<void>
} 