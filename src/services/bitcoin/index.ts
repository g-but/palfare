import { BitcoinTransaction, BitcoinWalletData } from '@/types/bitcoin';
import { isValidBitcoinAddress } from '@/lib/validation/address';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache storage
const cache = new Map<string, { data: BitcoinWalletData; timestamp: number }>();

// API configuration with different providers for fallback
const API_PROVIDERS = [
  {
    name: 'mempool.space',
    baseUrl: 'https://mempool.space/api',
    addressEndpoint: (address: string) => `/address/${address}`,
    txsEndpoint: (address: string) => `/address/${address}/txs`,
    processBalance: (data: any) => (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000,
    processTransactions: (data: any, address: string) => 
      data.slice(0, 5).map((tx: any) => {
        let type: 'incoming' | 'outgoing' = 'incoming';
        let value = 0;
        
        for (const input of tx.vin) {
          if (input.prevout && input.prevout.scriptpubkey_address === address) {
            type = 'outgoing';
            break;
          }
        }
        
        for (const output of tx.vout) {
          if (output.scriptpubkey_address === address) {
            value += output.value;
          }
        }
        
        return {
          txid: tx.txid,
          value: value / 100000000, // Convert satoshis to BTC
          status: tx.status.confirmed ? 'confirmed' : 'pending',
          timestamp: tx.status.block_time ? tx.status.block_time * 1000 : Date.now(),
          type
        };
      })
  },
  {
    name: 'blockstream.info',
    baseUrl: 'https://blockstream.info/api',
    addressEndpoint: (address: string) => `/address/${address}`,
    txsEndpoint: (address: string) => `/address/${address}/txs`,
    processBalance: (data: any) => (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000,
    processTransactions: (data: any, address: string) => 
      data.slice(0, 5).map((tx: any) => {
        let type: 'incoming' | 'outgoing' = 'incoming';
        let value = 0;
        
        for (const input of tx.vin) {
          if (input.prevout && input.prevout.scriptpubkey_address === address) {
            type = 'outgoing';
            break;
          }
        }
        
        for (const output of tx.vout) {
          if (output.scriptpubkey_address === address) {
            value += output.value;
          }
        }
        
        return {
          txid: tx.txid,
          value: value / 100000000,
          status: tx.status.confirmed ? 'confirmed' : 'pending',
          timestamp: tx.status.block_time ? tx.status.block_time * 1000 : Date.now(),
          type
        };
      })
  }
];

// Clean Bitcoin address from URI if needed
export const cleanBitcoinAddress = (address: string): string => {
  // Remove 'bitcoin:' prefix and any query parameters
  const cleanAddress = address.startsWith('bitcoin:') 
    ? address.split('?')[0].replace('bitcoin:', '')
    : address;
  
  // Validate the cleaned address
  if (!isValidBitcoinAddress(cleanAddress)) {
    throw new Error('Invalid Bitcoin address format');
  }
  
  return cleanAddress;
};

// Helper function to sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch wallet data with failover between different providers
export const fetchBitcoinWalletData = async (address: string): Promise<BitcoinWalletData> => {
  let cleanAddress: string;
  
  try {
    cleanAddress = cleanBitcoinAddress(address);
  } catch (error) {
    throw new Error('Invalid Bitcoin address format');
  }
  
  // Check cache first
  const cached = cache.get(cleanAddress);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  let lastError: Error | null = null;
  
  for (const provider of API_PROVIDERS) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Fetch address data
        const addressUrl = `${provider.baseUrl}${provider.addressEndpoint(cleanAddress)}`;
        const addressResponse = await fetch(addressUrl);
        
        if (!addressResponse.ok) {
          if (addressResponse.status === 400) {
            throw new Error('Invalid Bitcoin address');
          }
          if (addressResponse.status === 404) {
            throw new Error('Address not found');
          }
          throw new Error(`Failed to fetch from ${provider.name}: ${addressResponse.statusText}`);
        }
        
        const addressData = await addressResponse.json();
        const balance = provider.processBalance(addressData);
        
        // Fetch transaction data
        const txsUrl = `${provider.baseUrl}${provider.txsEndpoint(cleanAddress)}`;
        const txsResponse = await fetch(txsUrl);
        
        if (!txsResponse.ok) {
          throw new Error(`Failed to fetch transactions from ${provider.name}: ${txsResponse.statusText}`);
        }
        
        const txsData = await txsResponse.json();
        const transactions = provider.processTransactions(txsData, cleanAddress);
        
        const result = {
          balance,
          transactions,
          lastUpdated: Date.now()
        };
        
        // Update cache
        cache.set(cleanAddress, {
          data: result,
          timestamp: Date.now()
        });
        
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed for ${provider.name}:`, error);
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY * attempt); // Exponential backoff
        }
      }
    }
  }
  
  // If all providers and retries fail
  throw new Error(`Failed to fetch wallet data: ${lastError?.message}`);
};

// Format BTC value for display
export const formatBtcValue = (satoshis: number): string => {
  const btc = satoshis / 100000000;
  return btc.toLocaleString('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8
  });
};

// Get mempool.space transaction URL
export const getTransactionUrl = (txid: string): string => {
  return `https://mempool.space/tx/${txid}`;
};

// Get mempool.space address URL
export const getAddressUrl = (address: string): string => {
  return `https://mempool.space/address/${cleanBitcoinAddress(address)}`;
};
