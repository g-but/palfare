import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  address?: string
  txid?: string
  className?: string
}

export function ShareButton({ address, txid, className = '' }: ShareButtonProps) {
  const shareUrl = address 
    ? `https://mempool.space/address/${address}`
    : txid 
      ? `https://mempool.space/tx/${txid}`
      : ''

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: address ? 'Bitcoin Address' : 'Bitcoin Transaction',
        text: address ? 'Check out this Bitcoin address' : 'Check out this Bitcoin transaction',
        url: shareUrl
      })
    } else {
      window.open(shareUrl, '_blank')
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`p-2 text-gray-500 hover:text-orange-500 transition-colors ${className}`}
    >
      <Share2 className="h-5 w-5" />
    </button>
  )
} 