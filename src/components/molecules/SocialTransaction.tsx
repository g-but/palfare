import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExternalLink, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatBitcoinAmount, formatUsdAmount, getTransactionUrl } from '@/features/bitcoin/utils'
import { cn } from '@/lib/utils'

interface SocialTransactionProps {
  txid: string
  value: number
  status: 'confirmed' | 'pending'
  timestamp: number
  type: 'incoming' | 'outgoing'
  btcPrice: number | null
  onLike?: (txid: string) => void
  onDislike?: (txid: string) => void
  onComment?: (txid: string) => void
  onInquire?: (txid: string) => void
  likes?: number
  dislikes?: number
  comments?: number
  inquiries?: number
  className?: string
}

export function SocialTransaction({
  txid,
  value,
  status,
  timestamp,
  type,
  btcPrice,
  onLike,
  onDislike,
  onComment,
  onInquire,
  likes = 0,
  dislikes = 0,
  comments = 0,
  inquiries = 0,
  className
}: SocialTransactionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => onLike?.(txid)
  const handleDislike = () => onDislike?.(txid)
  const handleComment = () => onComment?.(txid)
  const handleInquire = () => onInquire?.(txid)

  return (
    <motion.div
      layout
      className={cn(
        'bg-white rounded-lg shadow-sm overflow-hidden',
        className
      )}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={cn(
                'text-xl font-semibold',
                type === 'incoming' ? 'text-green-600' : 'text-red-600'
              )}>
                {type === 'incoming' ? '+' : '-'}{formatBitcoinAmount(Math.abs(value))} BTC
              </span>
              {btcPrice !== null && (
                <span className="text-sm text-gray-600">
                  (${formatUsdAmount(value, btcPrice)})
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(timestamp * 1000).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              status === 'confirmed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            )}>
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

        <div className="mt-4 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="flex items-center space-x-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            className="flex items-center space-x-1"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{dislikes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="flex items-center space-x-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleInquire}
            className="flex items-center space-x-1"
          >
            <HelpCircle className="h-4 w-4" />
            <span>{inquiries}</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-4">
              <div className="space-y-4">
                {/* Comments section */}
                <div>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <h4 className="font-medium">Comments</h4>
                    {showComments ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  <AnimatePresence>
                    {showComments && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 space-y-2"
                      >
                        {/* Comment list would go here */}
                        <div className="text-sm text-gray-500">
                          No comments yet
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Inquiries section */}
                <div>
                  <h4 className="font-medium mb-2">Inquiries</h4>
                  <div className="space-y-2">
                    {/* Inquiry list would go here */}
                    <div className="text-sm text-gray-500">
                      No inquiries yet
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </div>
    </motion.div>
  )
} 