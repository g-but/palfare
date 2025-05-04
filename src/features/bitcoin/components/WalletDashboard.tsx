import { MissionStatement } from './mission/MissionStatement'
import { DonationSection } from './donation/DonationSection'
import { FinancialSection } from './financial/FinancialSection'

interface WalletDashboardProps {
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
  isOrangeCatWallet: boolean
  onLike: () => void
  onComment: () => void
  onRequestExplanation: () => void
}

export function WalletDashboard({
  address,
  balance,
  btcPrice,
  transactions,
  onRefresh,
  isOrangeCatWallet,
  onLike,
  onComment,
  onRequestExplanation
}: WalletDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Mission and Transparency */}
      <div className="lg:col-span-1">
        <MissionStatement />
      </div>

      {/* Middle Column: Donation Section */}
      <div className="lg:col-span-1">
        <DonationSection 
          address={address}
          onLike={onLike}
          onComment={onComment}
          onRequestExplanation={onRequestExplanation}
        />
      </div>

      {/* Right Column: Financial Information */}
      <div className="lg:col-span-1">
        <FinancialSection
          address={address}
          balance={balance}
          btcPrice={btcPrice}
          transactions={transactions}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  )
} 