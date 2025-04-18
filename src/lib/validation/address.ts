/**
 * Validates a Bitcoin address
 * Supports both legacy (1...), SegWit (bc1...), and Bitcoin URIs
 * @param address The Bitcoin address to validate
 * @returns boolean indicating if the address is valid
 */
export function isValidBitcoinAddress(address: string): boolean {
  // Clean the address if it's in URI format
  const cleanAddress = address.startsWith('bitcoin:') 
    ? address.split('?')[0].replace('bitcoin:', '')
    : address;

  // Legacy addresses (1...)
  const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
  
  // SegWit addresses (bc1...)
  const segwitRegex = /^bc1[ac-hj-np-z02-9]{11,71}$/
  
  // Test against valid formats
  return legacyRegex.test(cleanAddress) || segwitRegex.test(cleanAddress)
}

/**
 * Validates a Lightning address
 * Must be in the format username@domain.tld
 * @param address The Lightning address to validate
 * @returns boolean indicating if the address is valid
 */
export function isValidLightningAddress(address: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(address)
}

/**
 * Validates a website URL
 * Must start with http:// or https://
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidWebsite(url: string): boolean {
  try {
    new URL(url)
    return url.startsWith('http://') || url.startsWith('https://')
  } catch {
    return false
  }
} 