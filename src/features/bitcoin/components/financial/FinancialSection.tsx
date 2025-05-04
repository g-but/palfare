import { BitcoinBalance } from '../balance/BitcoinBalance'
import { TransactionList } from '../transaction/TransactionList'

interface FinancialSectionProps {
  address: string
  balance: number
  btcPrice: number | null
  transactions: Array<{
    txid: string
    value: number
    usdValue: number
    status: 'confirmed' | 'pending'
    timestamp: number
    type: 'incoming' | 'outgoing'
  }>
  onRefresh: () => void
}

export function FinancialSection({
  address,
  balance,
  btcPrice,
  transactions,
  onRefresh
}: FinancialSectionProps) {
  return (
    <div className="space-y-8">
      <BitcoinBalance 
        balance={balance}
        btcPrice={btcPrice}
        onRefresh={onRefresh}
        address={address}
      />
      <TransactionList 
        transactions={transactions}
        address={address}
        btcPrice={btcPrice}
      />
    </div>
  )
} 