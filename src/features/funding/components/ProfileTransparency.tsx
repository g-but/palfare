import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { FundingData } from '../types'
import { defaultData } from '../constants'
import { TransactionList } from '@/components/molecules/TransactionList'

interface ProfileTransparencyProps {
  data?: FundingData
  transactions: Array<{
    txid: string
    value: number
    time: number
    url: string
  }>
  className?: string
}

export function ProfileTransparency({ 
  data = defaultData, 
  transactions,
  className 
}: ProfileTransparencyProps) {
  const formattedTransactions = transactions.map(tx => ({
    txid: tx.txid,
    value: tx.value,
    status: 'confirmed' as const,
    timestamp: tx.time,
    type: tx.value > 0 ? 'incoming' as const : 'outgoing' as const
  }))

  return (
    <div className={className}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transparency Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold">Financial</h3>
                <p className="text-2xl">{data.transparency.financial}%</p>
              </div>
              <div>
                <h3 className="font-semibold">Operational</h3>
                <p className="text-2xl">{data.transparency.operational}%</p>
              </div>
              <div>
                <h3 className="font-semibold">Governance</h3>
                <p className="text-2xl">{data.transparency.governance}%</p>
              </div>
              <div>
                <h3 className="font-semibold">Impact</h3>
                <p className="text-2xl">{data.transparency.impact}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList
              transactions={formattedTransactions}
              useCardView={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 