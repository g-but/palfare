'use client'

import { useAuth } from '@/features/auth/hooks'
import { useUsers } from '@/features/profile/hooks'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatBitcoinAmount } from '@/features/bitcoin/utils'
import { Bitcoin, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function BrowsePage() {
  const { user: currentUser } = useAuth()
  const { users, loading, error } = useUsers()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white">
        <div className="container pt-32 pb-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiffany-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profiles...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white">
        <div className="container pt-32 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Profiles</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-tiffany-500 hover:bg-tiffany-600 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white">
      <div className="container pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Profiles</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover and support amazing projects and creators accepting Bitcoin donations.
            </p>
          </div>
          
          {users?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Bitcoin className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Profiles Found</h2>
              <p className="text-gray-600 mb-6">Be the first to create a profile and start accepting Bitcoin donations!</p>
              <Button
                onClick={() => window.location.href = '/auth?mode=register'}
                className="bg-tiffany-500 hover:bg-tiffany-600 text-white"
              >
                Create Your Profile
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users?.map((user) => (
                <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.display_name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <Bitcoin className="h-6 w-6 text-orange-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900 truncate">
                        {user.display_name}
                      </h2>
                      {user.bio && (
                        <p className="text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
                      )}
                      
                      {user.bitcoin_address && (
                        <div className="mt-3 flex items-center space-x-2">
                          <Bitcoin className="h-5 w-5 text-tiffany-600" />
                          <span className="text-sm text-gray-600">
                            {formatBitcoinAmount(user.balance || 0)} BTC
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Link href={`/profile/${user.id}`}>
                      <Button variant="outline" className="flex items-center">
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 