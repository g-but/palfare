import { QRCodeSVG } from 'qrcode.react'
import { BitcoinAddress } from '../atoms/BitcoinAddress'
import { BitcoinBalance } from '../atoms/BitcoinBalance'
import { MissionStatement } from '../molecules/MissionStatement'
import { TransactionList } from '../molecules/TransactionList'

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
}

export function WalletDashboard({
  address,
  balance,
  btcPrice,
  transactions,
  onRefresh,
  isOrangeCatWallet
}: WalletDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Profile and Mission */}
      <div className="lg:col-span-1">
        {isOrangeCatWallet ? (
          <>
            <MissionStatement />
            <BitcoinAddress address={address} />
          </>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Search Bitcoin Address</h3>
            <div className="font-mono text-sm break-all mb-2">{address}</div>
            <p className="text-sm text-gray-500">
              Enter any Bitcoin address to view its balance and transactions
            </p>
          </div>
        )}
      </div>

      {/* Middle Column: QR Code and Balance */}
      <div className="lg:col-span-1 flex flex-col items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <QRCodeSVG 
            value={`bitcoin:${address}`}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <BitcoinBalance 
          balance={balance}
          btcPrice={btcPrice}
          onRefresh={onRefresh}
          address={address}
        />
      </div>

      {/* Right Column: Recent Transactions */}
      <div className="lg:col-span-1">
        <TransactionList 
          transactions={transactions}
          address={address}
          btcPrice={btcPrice}
        />
      </div>
    </div>
  )
} 