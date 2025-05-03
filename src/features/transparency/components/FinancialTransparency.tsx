import { Bitcoin, RefreshCw, ExternalLink, Users, ArrowDownToLine, TrendingUp } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { TransactionCard } from '@/components/bitcoin/TransactionCard'

interface FinancialTransparencyProps {
  address: string
  balance: number
  btcPrice: number | null
  transactions: any[]
  isLoading: boolean
  onRefresh: () => Promise<void>
}

export function FinancialTransparency({
  address,
  balance,
  btcPrice,
  transactions,
  isLoading,
  onRefresh
}: FinancialTransparencyProps) {
  const formatBtcAmount = (sats: number) => {
    if (!sats) return '0.00000'
    const btc = sats / 100000000
    return btc.toFixed(5)
  }

  const formatUsdAmount = (sats: number, price: number | null) => {
    if (!sats || !price) return null
    const usd = (sats / 100000000) * price
    return usd.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }

  const calculateUniqueDonors = (transactions: any[]) => {
    const uniqueAddresses = new Set(transactions.map(tx => tx.address))
    return uniqueAddresses.size
  }

  const calculateAverageDonation = (transactions: any[]) => {
    if (transactions.length === 0) return '0.00000'
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    const average = total / transactions.length
    return formatBtcAmount(average)
  }

  const calculateAverageDonationPerDonor = (transactions: any[]) => {
    if (transactions.length === 0) return '0.00000'
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    const uniqueDonors = calculateUniqueDonors(transactions)
    const average = total / uniqueDonors
    return formatBtcAmount(average)
  }

  const handleRequestInfo = (txid: string) => {
    // TODO: Implement info request
    console.log('Requesting info for transaction:', txid)
  }

  const handleComment = (txid: string) => {
    // TODO: Implement commenting
    console.log('Commenting on transaction:', txid)
  }

  return (
    <section id="transparency" className="bg-white p-8 rounded-lg shadow-sm">
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="group p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <Bitcoin className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Total Balance</span>
          </div>
          <div className="text-xl font-bold text-gray-900 group-hover:text-orange-600">
            {formatBtcAmount(balance)} BTC
          </div>
          {btcPrice && (
            <div className="text-sm text-gray-600">
              ${formatUsdAmount(balance, btcPrice)}
            </div>
          )}
        </div>
        <div className="group p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <Bitcoin className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Total Transactions</span>
          </div>
          <div className="text-xl font-bold text-gray-900 group-hover:text-orange-600">
            {transactions.length}
          </div>
          <div className="text-sm text-gray-600">
            {calculateUniqueDonors(transactions)} unique donors
          </div>
        </div>
        <div className="group p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <ArrowDownToLine className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Average Donation</span>
          </div>
          <div className="text-xl font-bold text-gray-900 group-hover:text-orange-600">
            {calculateAverageDonation(transactions)} BTC
          </div>
          <div className="text-sm text-gray-600">
            per transaction
          </div>
        </div>
        <div className="group p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Average Per Donor</span>
          </div>
          <div className="text-xl font-bold text-gray-900 group-hover:text-orange-600">
            {calculateAverageDonationPerDonor(transactions)} BTC
          </div>
          <div className="text-sm text-gray-600">
            per unique donor
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Wallet Information */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Bitcoin Address</h3>
              <button
                onClick={onRefresh}
                className="flex items-center space-x-1 text-gray-600 hover:text-orange-500"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                {address}
              </div>
              <a 
                href={`https://mempool.space/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-500 mb-2">QR Code</div>
              <div className="bg-white p-3 rounded-lg inline-block">
                <QRCodeSVG 
                  value={`bitcoin:${address}`}
                  size={128}
                  level="H"
                  includeMargin
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Transactions</h3>
          
          {isLoading ? (
            <div className="text-gray-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-gray-500">No transactions yet</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx.txid}
                  transaction={tx}
                  btcPrice={btcPrice}
                  onRequestInfo={handleRequestInfo}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 