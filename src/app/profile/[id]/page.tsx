'use client'

import { useUser } from '@/features/profile/hooks'
import { useAuth } from '@/features/auth/hooks'
import { TransactionList } from '@/components/molecules/TransactionList'
import { formatBitcoinAmount } from '@/features/bitcoin/utils'
import { Bitcoin, Copy, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user: currentUser } = useAuth()
  const { user, bitcoinData, loading, error } = useUser(params.id)
  const isOwnProfile = currentUser?.id === params.id

  const copyAddress = () => {
    if (user?.bitcoin_address) {
      navigator.clipboard.writeText(user.bitcoin_address)
      toast.success('Bitcoin address copied to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiffany-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
            <p className="text-gray-600">
              The profile you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.display_name}
                </h1>
                {user.bio && (
                  <p className="text-gray-600 mt-2">{user.bio}</p>
                )}
              </div>
              {isOwnProfile && (
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Bitcoin Section */}
          {user.bitcoin_address && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bitcoin Wallet
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <QRCodeSVG 
                    value={user.bitcoin_address}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center bg-gray-50 p-4 rounded-lg mb-4">
                <Bitcoin className="h-6 w-6 text-tiffany-600 mr-3" />
                <span className="font-mono text-gray-900 break-all">
                  {user.bitcoin_address}
                </span>
              </div>

              {/* Balance */}
              {bitcoinData && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Balance</span>
                    <span className="font-semibold">
                      {formatBitcoinAmount(bitcoinData.balance)} BTC
                    </span>
                  </div>
                  {bitcoinData.btcPrice && (
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>USD Value</span>
                      <span>
                        ${(bitcoinData.balance * bitcoinData.btcPrice / 100000000).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Transactions */}
          {bitcoinData && bitcoinData.transactions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Transactions
              </h2>
              <TransactionList 
                transactions={bitcoinData.transactions}
                btcPrice={bitcoinData.btcPrice}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 