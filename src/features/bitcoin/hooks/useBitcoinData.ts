import { useState, useCallback, useEffect } from 'react'
import { BitcoinWalletData } from '../types'
import { fetchBitcoinData } from '../services/mempool'

export function useBitcoinData(address: string) {
  const [bitcoinData, setBitcoinData] = useState<BitcoinWalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshBitcoinData = useCallback(async () => {
    try {
      console.log('Fetching Bitcoin data for address:', address)
      setIsLoading(true)
      setError(null)
      const data = await fetchBitcoinData(address)
      console.log('Bitcoin data fetched:', data)
      setBitcoinData(data)
    } catch (err) {
      console.error('Error fetching Bitcoin data:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch Bitcoin data'))
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    console.log('Initializing Bitcoin data fetch for address:', address)
    refreshBitcoinData()
  }, [refreshBitcoinData, address])

  return {
    bitcoinData,
    isLoading,
    error,
    refreshBitcoinData
  }
} 