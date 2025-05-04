import { motion } from 'framer-motion'
import { RefreshCw, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { FundingData } from '../types'
import { cn } from '@/lib/utils'
import { TransactionList } from '@/components/molecules/TransactionList'
import { defaultData } from '../constants'

interface ProfileStats {
  balance: number
  btcPrice: number | null
  transactions: Array<{
    txid: string
    value: number
    time: number
    url: string
  }>
}

interface ProfileHeaderProps {
  data?: FundingData
  stats: ProfileStats
  address: string
  onRefresh: () => void
  isLoading: boolean
  className?: string
}

export function ProfileHeader({ 
  data = defaultData, 
  stats, 
  address, 
  onRefresh, 
  isLoading, 
  className 
}: ProfileHeaderProps) {
  const mempoolUrl = `https://mempool.space/address/${address}`
  const balanceInUsd = stats.balance && stats.btcPrice ? (stats.balance * stats.btcPrice) / 100000000 : null

  const formattedTransactions = stats.transactions.map(tx => ({
    txid: tx.txid,
    value: tx.value,
    status: 'confirmed' as const,
    timestamp: tx.time,
    type: tx.value > 0 ? 'incoming' as const : 'outgoing' as const
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('space-y-6', className)}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-orange-500 to-teal-400 flex items-center justify-center text-white text-2xl font-bold">
                {data.mission.title.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl">{data.mission.title}</CardTitle>
              <p className="mt-2 text-muted-foreground">{data.mission.description}</p>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                    <p className="text-2xl font-bold">
                      {(stats.balance / 100000000).toFixed(4)} BTC
                    </p>
                    {balanceInUsd && (
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(balanceInUsd)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={onRefresh}
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={mempoolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Mempool
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <TransactionList
        transactions={formattedTransactions}
        address={address}
        btcPrice={stats.btcPrice}
        isLoading={isLoading}
        useCardView={true}
      />
    </motion.div>
  )
} 