'use client'

import { Bitcoin, Loader2 } from 'lucide-react'
import { formatBitcoinAmount, formatUSD } from '@/features/bitcoin/utils'

interface BalanceDisplayProps {
  balance: number
  btcPrice: number
  isLoading: boolean
  error?: string | null
}

export function BalanceDisplay({ balance, btcPrice, isLoading, error }: BalanceDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load balance
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Bitcoin className="w-8 h-8 text-orange-500" />
        <div>
          <div className="text-3xl font-bold font-mono">
            {formatBitcoinAmount(balance)} BTC
          </div>
          <div className="text-lg text-gray-500">
            {formatUSD(balance, btcPrice)}
          </div>
        </div>
      </div>
    </div>
  )
} 