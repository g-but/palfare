import { Bitcoin, Copy, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Button from '@/components/ui/Button'
import { toast } from 'sonner'

interface DonationSectionProps {
  address: string
}

export function DonationSection({ address }: DonationSectionProps) {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const handleViewOnMempool = () => {
    window.open(`https://mempool.space/address/${address}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Support Our Mission</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <QRCodeSVG 
              value={`bitcoin:${address}`}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          <div className="w-full space-y-4">
            <div className="flex items-center space-x-2">
              <Bitcoin className="h-5 w-5 text-orange-500" />
              <span className="font-mono text-sm break-all">{address}</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCopyAddress}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleViewOnMempool}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Mempool
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 