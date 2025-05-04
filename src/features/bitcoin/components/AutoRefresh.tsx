'use client'

import { useEffect, useState } from 'react'
import { RefreshCcw } from 'lucide-react'

interface AutoRefreshProps {
  onRefresh: () => Promise<void>
  interval?: number
}

export function AutoRefresh({ onRefresh, interval = 30000 }: AutoRefreshProps) {
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      onRefresh()
      setLastRefresh(Date.now())
    }, interval)

    return () => clearInterval(timer)
  }, [onRefresh, interval])

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <RefreshCcw className="w-4 h-4 animate-spin" />
      Auto-refresh enabled
    </div>
  )
} 