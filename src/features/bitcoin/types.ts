export interface Transaction {
  txid: string
  value: number
  status: 'confirmed' | 'pending'
  timestamp: number
  type: 'incoming' | 'outgoing'
}

export interface BitcoinWalletData {
  address: string
  balance: number
  btcPrice: number | null
  transactions: Transaction[]
  lastUpdated: number
} 