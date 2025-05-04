import { Transaction, BitcoinWalletData } from './types'
import { formatBtcAmount } from '../finance/service'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

interface MempoolAddressResponse {
  chain_stats: {
    funded_txo_sum: number
    spent_txo_sum: number
  }
  txs: Array<{
    txid: string
    status: {
      block_time: number
    }
    vout: Array<{
      value: number
      scriptpubkey_address: string
    }>
  }>
}

interface MempoolPriceResponse {
  USD: number
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response | null> {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying request to ${url} (${retries} attempts remaining)`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return fetchWithRetry(url, options, retries - 1)
    }
    console.error(`Failed to fetch ${url} after ${MAX_RETRIES} attempts:`, error)
    return null
  }
}

export function getTransactionUrl(txid: string): string {
  return `https://mempool.space/tx/${txid}`
}

export function formatBitcoinAmount(amount: number): string {
  return (amount / 100000000).toFixed(4)
}

const BITCOIN_ADDRESS = 'bc1qgsup75ajy4rln08j0te9wpdgrf46ctx6w94xzq'
const MEMPOOL_API = 'https://mempool.space/api'
const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export async function fetchBitcoinData(): Promise<BitcoinWalletData> {
  try {
    const [addressData, priceData] = await Promise.all([
      fetch(`${MEMPOOL_API}/address/${BITCOIN_ADDRESS}`).then(res => res.json()).catch(() => null),
      fetch(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd`).then(res => res.json()).catch(() => null)
    ])

    if (!addressData) {
      console.error('Failed to fetch address data')
      return {
        address: BITCOIN_ADDRESS,
        balance: 0,
        btcPrice: null,
        transactions: [],
        lastUpdated: Date.now()
      }
    }

    const transactions: Transaction[] = addressData.txids.map((txid: string) => ({
      txid,
      time: addressData.mempool_txs.find((tx: any) => tx.txid === txid)?.time || 0,
      value: addressData.mempool_txs.find((tx: any) => tx.txid === txid)?.value || 0,
      address: BITCOIN_ADDRESS,
      verified: true,
      url: `https://mempool.space/tx/${txid}`
    }))

    return {
      address: BITCOIN_ADDRESS,
      balance: addressData.chain_stats.funded_txo_sum - addressData.chain_stats.spent_txo_sum,
      btcPrice: priceData?.bitcoin?.usd || null,
      transactions,
      lastUpdated: Date.now()
    }
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error)
    return {
      address: BITCOIN_ADDRESS,
      balance: 0,
      btcPrice: null,
      transactions: [],
      lastUpdated: Date.now()
    }
  }
}

export function generateTransactionUrl(txid: string): string {
  return `https://mempool.space/tx/${txid}`
} 