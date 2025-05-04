import { motion } from 'framer-motion'
import { BitcoinBalance } from '@/components/atoms/BitcoinBalance'
import { BitcoinAddress } from '@/components/atoms/BitcoinAddress'
import { ShareButton } from '@/components/atoms/ShareButton'

interface BalanceCardProps {
  balance: number
  address: string
  btcPrice: number | null
  className?: string
}

export function BalanceCard({ balance, address, btcPrice, className = '' }: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-lg shadow-sm p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Wallet Balance</h2>
        <ShareButton address={address} />
      </div>

      <div className="space-y-4">
        <BitcoinBalance balance={balance} btcPrice={btcPrice} />
        <BitcoinAddress address={address} />
      </div>
    </motion.div>
  )
} 