import { RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { BitcoinWalletData } from '../types'

interface BalanceCardProps {
  data: BitcoinWalletData
  onRefresh: () => void
  isLoading?: boolean
}

export function BalanceCard({ data, onRefresh, isLoading }: BalanceCardProps) {
  const formatBitcoinAmount = (amount: number) => {
    return (amount / 100000000).toFixed(4)
  }

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const usdValue = data.btcPrice ? (data.balance / 100000000) * data.btcPrice : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bitcoin Balance</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          isLoading={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatBitcoinAmount(data.balance)} BTC</div>
        <p className="text-xs text-muted-foreground">
          {formatUSD(usdValue)}
        </p>
      </CardContent>
    </Card>
  )
} 