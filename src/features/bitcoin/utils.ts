export function formatBitcoinAmount(amount: number): string {
  return amount.toFixed(8)
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

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
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