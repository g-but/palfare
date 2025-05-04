export function formatBitcoinAmount(sats: number): string {
  if (!sats) return '0.00000000'
  const btc = sats / 100000000
  return btc.toFixed(8)
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatUSD(sats: number, btcPrice: number): string {
  if (!sats || !btcPrice) return '$0.00'
  const btc = sats / 100000000
  const usd = btc * btcPrice
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(usd)
}

export const formatUsdAmount = (sats: number, price: number | null) => {
  if (!sats || !price) return null
  return ((sats / 100000000) * price).toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
}

export const getTransactionUrl = (txid: string) => {
  return `https://mempool.space/tx/${txid}`
}

export const getAddressUrl = (address: string) => {
  return `https://mempool.space/address/${address}`
} 