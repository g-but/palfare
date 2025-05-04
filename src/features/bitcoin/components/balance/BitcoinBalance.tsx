import { formatBitcoinAmount, formatUsdAmount } from '@/features/bitcoin/service'
import Button from '@/components/ui/Button'
import { ExternalLink } from 'lucide-react'

interface BitcoinBalanceProps {
  balance: number
  btcPrice: number | null
  onRefresh: () => void
  address: string
}

export function BitcoinBalance({ balance, btcPrice, onRefresh, address }: BitcoinBalanceProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Current Balance</h3>
        <a 
          href={`https://mempool.space/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 text-sm flex items-center"
        >
          Verify on Mempool.space
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatBitcoinAmount(balance)} BTC
        </div>
        {btcPrice !== null && (
          <div className="text-lg text-gray-600">
            {formatUsdAmount(balance * btcPrice)}
          </div>
        )}
        <div className="mt-4">
          <Button 
            onClick={onRefresh}
            variant="outline"
            className="w-full"
          >
            Refresh Balance
          </Button>
        </div>
      </div>
    </div>
  )
} 