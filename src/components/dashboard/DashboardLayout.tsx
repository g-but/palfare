import { useProfile } from '@/contexts/ProfileContext'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import { ProfileHeader } from './ProfileHeader'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { profile, loading } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/create-profile')
    }
  }, [loading, profile, router])

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiffany-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProfileHeader profile={profile} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1">
            <Card title="Donation Stats">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Donations</p>
                  <p className="text-2xl font-bold">0 sats</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Donation</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-2">
            <Card title="Recent Activity">
              <div className="text-center text-gray-500 py-8">
                No recent activity
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 