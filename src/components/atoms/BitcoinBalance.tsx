import { formatBitcoinAmount, formatUsdAmount } from '@/features/bitcoin/service'
import Button from '../ui/Button'
import { ExternalLink, RefreshCw } from 'lucide-react'

interface BitcoinBalanceProps {
  balance: number
  btcPrice: number | null
  onRefresh?: () => void
  address?: string
  className?: string
}

export function BitcoinBalance({ 
  balance, 
  btcPrice, 
  onRefresh,
  address,
  className = '' 
}: BitcoinBalanceProps) {
  const formatBtcAmount = (sats: number) => {
    return sats ? (sats / 100000000).toFixed(8) : '0.00000000'
  }

  const formatUsdAmount = (sats: number, price: number | null) => {
    if (!sats || !price) return null
    return ((sats / 100000000) * price).toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-gray-900">
          {formatBtcAmount(balance)} BTC
        </span>
        {btcPrice && (
          <span className="text-lg text-gray-500">
            (${formatUsdAmount(balance, btcPrice)})
          </span>
        )}
      </div>
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="text-gray-500 hover:text-orange-500"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="ml-2">Refresh Balance</span>
        </Button>
      )}
    </div>
  )
} 