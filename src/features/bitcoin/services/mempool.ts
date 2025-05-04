import { BitcoinWalletData, Transaction } from '../types'

const MEMPOOL_API = 'https://mempool.space/api'
const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export async function fetchBitcoinData(address: string): Promise<BitcoinWalletData> {
  try {
    console.log('Fetching from Mempool API for address:', address)
    const addressResponse = await fetch(`${MEMPOOL_API}/address/${address}`)
    if (!addressResponse.ok) {
      throw new Error(`Mempool API error: ${addressResponse.status}`)
    }
    const addressData = await addressResponse.json()
    console.log('Mempool API response:', addressData)

    if (!addressData || !addressData.chain_stats) {
      throw new Error('Invalid Mempool API response format')
    }

    console.log('Fetching from CoinGecko API...')
    const priceResponse = await fetch(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd`)
    if (!priceResponse.ok) {
      throw new Error(`CoinGecko API error: ${priceResponse.status}`)
    }
    const priceData = await priceResponse.json()
    console.log('CoinGecko API response:', priceData)

    // Fetch transaction details
    const transactions: Transaction[] = []
    if (addressData.txids && Array.isArray(addressData.txids)) {
      for (const txid of addressData.txids) {
        const txResponse = await fetch(`${MEMPOOL_API}/tx/${txid}`)
        if (!txResponse.ok) continue
        
        const txData = await txResponse.json()
        const isIncoming = txData.vout.some((vout: any) => vout.scriptpubkey_address === address)
        const value = isIncoming 
          ? txData.vout.find((vout: any) => vout.scriptpubkey_address === address)?.value || 0
          : txData.vin.reduce((sum: number, vin: any) => sum + (vin.prevout?.value || 0), 0)

        transactions.push({
          txid,
          value: isIncoming ? value : -value,
          status: txData.status.confirmed ? 'confirmed' : 'pending',
          timestamp: txData.status.block_time || txData.status.block_height || Date.now() / 1000,
          type: isIncoming ? 'incoming' : 'outgoing'
        })
      }
    }

    const data = {
      address,
      balance: addressData.chain_stats.funded_txo_sum - addressData.chain_stats.spent_txo_sum,
      btcPrice: priceData?.bitcoin?.usd || null,
      transactions,
      lastUpdated: Date.now()
    }

    console.log('Processed Bitcoin data:', data)
    return data
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error)
    // Return a valid but empty state instead of throwing
    return {
      address,
      balance: 0,
      btcPrice: null,
      transactions: [],
      lastUpdated: Date.now()
    }
  }
} 