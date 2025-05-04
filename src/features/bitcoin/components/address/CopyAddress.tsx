'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CopyAddressProps {
  address: string
}

export function CopyAddress({ address }: CopyAddressProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <code className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
        {address}
      </code>
      <Button
        onClick={handleCopy}
        variant="outline"
        className="flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy
          </>
        )}
      </Button>
    </div>
  )
} 