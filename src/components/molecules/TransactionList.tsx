import { motion } from 'framer-motion'
import { SocialTransaction } from './SocialTransaction'
import { formatBitcoinAmount } from '@/features/bitcoin/utils'

interface Transaction {
  txid: string
  value: number
  status: 'confirmed' | 'pending'
  timestamp: number
  type: 'incoming' | 'outgoing'
}

interface TransactionListProps {
  transactions: Transaction[]
  address?: string
  btcPrice?: number | null
  onLike?: (txid: string) => void
  onDislike?: (txid: string) => void
  onComment?: (txid: string) => void
  onInquire?: (txid: string) => void
  isLoading?: boolean
  className?: string
}

export function TransactionList({ 
  transactions, 
  address, 
  btcPrice, 
  onLike,
  onDislike,
  onComment,
  onInquire,
  isLoading = false,
  className
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions yet
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <SocialTransaction
            key={transaction.txid}
            txid={transaction.txid}
            value={transaction.value}
            status={transaction.status}
            timestamp={transaction.timestamp}
            type={transaction.type}
            btcPrice={btcPrice || null}
            onLike={onLike}
            onDislike={onDislike}
            onComment={onComment}
            onInquire={onInquire}
          />
        ))}
      </div>
    </motion.div>
  )
} 