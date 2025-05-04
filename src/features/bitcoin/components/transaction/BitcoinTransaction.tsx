import { formatBitcoinAmount, formatUsdAmount, getTransactionUrl } from '@/features/bitcoin/service'
import { ExternalLink, Heart, MessageSquare, HelpCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface BitcoinTransactionProps {
  txid: string
  value: number
  usdValue: number
  status: 'confirmed' | 'pending'
  timestamp: number
  type: 'incoming' | 'outgoing'
  btcPrice: number | null
  onLike: () => void
  onComment: () => void
  onRequestExplanation: () => void
}

export function BitcoinTransaction({ 
  txid, 
  value, 
  usdValue, 
  status, 
  timestamp, 
  type,
  btcPrice,
  onLike,
  onComment,
  onRequestExplanation
}: BitcoinTransactionProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold text-gray-900">
            {type === 'incoming' ? '+' : '-'}{formatBitcoinAmount(Math.abs(value))} BTC
          </div>
          {btcPrice !== null && (
            <div className="text-sm text-gray-600">
              {formatUsdAmount(usdValue)}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'confirmed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status}
          </span>
          <a 
            href={getTransactionUrl(txid)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {new Date(timestamp * 1000).toLocaleString()}
      </div>
      <div className="mt-4 flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onLike}
          className="flex items-center"
          size="sm"
        >
          <Heart className="h-4 w-4 mr-2" />
          Like
        </Button>
        <Button 
          variant="outline" 
          onClick={onComment}
          className="flex items-center"
          size="sm"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Comment
        </Button>
        <Button 
          variant="outline" 
          onClick={onRequestExplanation}
          className="flex items-center"
          size="sm"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Request Explanation
        </Button>
      </div>
    </div>
  )
} 