"use client";

import { useAuth } from '@/features/auth/hooks'
import { useUser } from '@/features/profile/hooks'
import { useBitcoinData } from '@/features/bitcoin/hooks/useBitcoinData'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatBitcoinAmount } from '@/features/bitcoin/utils'
import { Bitcoin } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function FundUsPage() {
  const { user } = useAuth()
  const { user: profile } = useUser(user?.id || '')
  const { bitcoinData, isLoading, error, refreshBitcoinData } = useBitcoinData(profile?.bitcoin_address || '')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refreshBitcoinData()
      toast.success('Balance updated')
    } catch (err) {
      toast.error('Failed to update balance')
    } finally {
      setIsRefreshing(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <h1 className="mb-4 text-2xl font-bold">Fund Us</h1>
          <p className="text-gray-600">Please sign in to view your Bitcoin wallet.</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <h1 className="mb-4 text-2xl font-bold">Fund Us</h1>
          <p className="text-gray-600">Loading wallet data...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <h1 className="mb-4 text-2xl font-bold">Fund Us</h1>
          <p className="text-red-600">Error loading wallet data</p>
          <Button onClick={handleRefresh} disabled={isRefreshing} className="mt-4">
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-4 text-2xl font-bold">Fund Us</h1>
        <div className="mb-6">
          <p className="text-gray-600">Your Bitcoin Address:</p>
          <p className="font-mono text-lg">{profile?.bitcoin_address}</p>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">Current Balance:</p>
          <div className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6" />
            <p className="text-2xl font-bold">
              {formatBitcoinAmount(bitcoinData?.balance || 0)}
            </p>
          </div>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing...' : 'Refresh Balance'}
        </Button>
      </Card>
    </div>
  )
} 