"use client";

import { useEffect } from 'react'
import { Bitcoin, QrCode, ArrowRight, RefreshCcw } from 'lucide-react'
import { useBitcoinData } from '@/features/bitcoin/hooks/useBitcoinData'
import { TransactionList } from '@/features/bitcoin/components/transaction/TransactionList'
import { QRCode } from '@/features/bitcoin/components/address/QRCode'
import { BalanceDisplay } from '@/features/bitcoin/components/balance/BalanceDisplay'
import { CopyAddress } from '@/features/bitcoin/components/address/CopyAddress'
import { AutoRefresh } from '@/features/bitcoin/components/AutoRefresh'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const ORANGE_CAT_ADDRESS = 'bc1qgsup75ajy4rln08j0te9wpdgrf46ctx6w94xzq'

export default function FundUsPage() {
  const { bitcoinData, isLoading, error, refreshBitcoinData } = useBitcoinData(ORANGE_CAT_ADDRESS)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Orange Cat</h1>
          <p className="text-xl text-gray-600 mb-8">
            Why Support Us?
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Orange Cat is dedicated to making Bitcoin donations accessible to everyone. 
            Your support helps us continue building and improving our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 flex flex-col items-center text-center">
            <Bitcoin className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Bitcoin Only</h3>
            <p className="text-gray-600">Supporting the original cryptocurrency</p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center">
            <RefreshCcw className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Zero Fees</h3>
            <p className="text-gray-600">100% of your donation goes to development</p>
          </Card>
        </div>

        <Card className="mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <QRCode address={ORANGE_CAT_ADDRESS} />
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Scan the QR code or copy the address to send Bitcoin</h2>
                <CopyAddress address={ORANGE_CAT_ADDRESS} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Bitcoin Balance</h2>
            <BalanceDisplay 
              balance={bitcoinData?.balance || 0} 
              btcPrice={bitcoinData?.btcPrice || 0} 
              isLoading={isLoading}
              error={error}
            />
          </div>
        </Card>

        <Card className="mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Transactions</h2>
              <Link 
                href={`https://mempool.space/address/${ORANGE_CAT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 flex items-center gap-2"
              >
                View all transactions on Mempool
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <TransactionList 
              transactions={bitcoinData?.transactions || []} 
              isLoading={isLoading}
              error={error}
            />
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <AutoRefresh onRefresh={refreshBitcoinData} />
          <Link href="/create" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
            Create Your Own Donation Page
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
} 