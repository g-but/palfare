'use client'

import { useState, useEffect } from 'react'
import { fetchBitcoinData } from '../services/mempool'
import { BitcoinWalletData } from '../types'

export function useBitcoinData(address: string) {
  const [bitcoinData, setBitcoinData] = useState<BitcoinWalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchBitcoinData(address)
      setBitcoinData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Bitcoin data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (address) {
      fetchData()
    }
  }, [address])

  const refreshBitcoinData = async () => {
    await fetchData()
  }

  return {
    bitcoinData,
    isLoading,
    error,
    refreshBitcoinData
  }
} 