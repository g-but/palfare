import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'

interface BitcoinAddressProps {
  address: string
}

export function BitcoinAddress({ address }: BitcoinAddressProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Donate Bitcoin</h3>
      <div className="font-mono text-sm break-all mb-2">{address}</div>
      <Button 
        onClick={copyToClipboard} 
        className="w-full"
        variant="outline"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy Bitcoin Address
          </>
        )}
      </Button>
    </div>
  )
} 