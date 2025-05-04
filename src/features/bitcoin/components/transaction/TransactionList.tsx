'use client'

import { Transaction } from '@/features/bitcoin/types'
import { formatBitcoinAmount, formatTimestamp } from '@/features/bitcoin/utils'
import { Bitcoin, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  error?: string | null
}

export function TransactionList({ transactions, isLoading, error }: TransactionListProps) {
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
        Failed to load transactions
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.txid} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {tx.type === 'incoming' ? (
              <ArrowDownLeft className="w-5 h-5 text-green-500" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                <span className="font-mono font-medium">
                  {formatBitcoinAmount(tx.value)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {formatTimestamp(tx.timestamp)}
              </div>
            </div>
          </div>
          <div className="text-sm">
            <span className={tx.status === 'confirmed' ? 'text-green-500' : 'text-orange-500'}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 