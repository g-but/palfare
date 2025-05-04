import { Database } from '@/types/database'

// Core user types
export interface User {
  id: string
  email: string
  display_name: string
  bio?: string
  avatar_url?: string
  bitcoin_address?: string
  balance?: number
  created_at: string
  updated_at: string
}

// Form types
export interface UserFormData {
  display_name: string
  bio?: string
  avatar_url?: string
  bitcoin_address?: string
}

// Bitcoin data types
export interface BitcoinData {
  address: string
  balance: number
  btcPrice: number | null
  transactions: Transaction[]
  lastUpdated: number
}

export interface Transaction {
  txid: string
  value: number
  status: 'confirmed' | 'pending'
  timestamp: number
  type: 'incoming' | 'outgoing'
}

// Service response types
export interface UserServiceResponse {
  success: boolean
  user?: User
  error?: string
}

// Hook return types
export interface UseUserReturn {
  user: User | null
  bitcoinData: BitcoinData | null
  loading: boolean
  error: string | null
  update: (data: UserFormData) => Promise<UserServiceResponse>
  refresh: () => Promise<void>
} 