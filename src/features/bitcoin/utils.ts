export const formatBitcoinAmount = (sats: number) => {
  return sats ? (sats / 100000000).toFixed(8) : '0.00000000'
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