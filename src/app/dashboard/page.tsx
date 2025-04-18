'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { Plus, Bitcoin, ArrowRight, User, Settings, BarChart, Check, X } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface FundPage {
  id: string
  title: string
  description: string
  created_at: string
  bitcoin_address: string
  lightning_address: string | null
}

interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  website: string | null
  twitter: string | null
  github: string | null
}

interface ProfileCompletion {
  total: number
  completed: number
  percentage: number
  missingFields: string[]
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [pages, setPages] = useState<FundPage[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const calculateProfileCompletion = (profile: Profile | null): ProfileCompletion => {
    if (!profile) return { total: 0, completed: 0, percentage: 0, missingFields: [] }

    const fields = [
      { key: 'display_name', label: 'Display Name' },
      { key: 'avatar_url', label: 'Profile Picture' },
      { key: 'bio', label: 'Bio' },
      { key: 'website', label: 'Website' },
      { key: 'twitter', label: 'Twitter' },
      { key: 'github', label: 'GitHub' }
    ]

    const completed = fields.filter(field => profile[field.key as keyof Profile]).length
    const missingFields = fields
      .filter(field => !profile[field.key as keyof Profile])
      .map(field => field.label)

    return {
      total: fields.length,
      completed,
      percentage: Math.round((completed / fields.length) * 100),
      missingFields
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error('User not authenticated')
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(profileData)

        // Fetch pages
        const { data: pagesData, error } = await supabase
          .from('fund_pages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPages(pagesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const profileCompletion = calculateProfileCompletion(profile)

  return (
    <ProtectedRoute>
      <main className="min-h-screen pt-20 bg-gradient-to-b from-white to-gray-50">
        <section className="section">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {/* Profile Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-tiffany-100 flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.display_name || profile.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-tiffany-600" />
                        )}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Welcome back, {profile?.display_name || profile?.username || 'there'}!
                        </h1>
                        <p className="text-gray-600">
                          Manage your donation pages and track your impact
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/settings')}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </div>

                  {/* Profile Completion Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
                      <span className="text-sm font-medium text-tiffany-600">
                        {profileCompletion.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-tiffany-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion.percentage}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'display_name', label: 'Display Name', icon: profile?.display_name ? Check : X },
                        { key: 'avatar_url', label: 'Profile Picture', icon: profile?.avatar_url ? Check : X },
                        { key: 'bio', label: 'Bio', icon: profile?.bio ? Check : X },
                        { key: 'website', label: 'Website', icon: profile?.website ? Check : X },
                        { key: 'twitter', label: 'Twitter', icon: profile?.twitter ? Check : X },
                        { key: 'github', label: 'GitHub', icon: profile?.github ? Check : X }
                      ].map((field) => {
                        const Icon = field.icon
                        const isCompleted = profile?.[field.key as keyof Profile]
                        return (
                          <div
                            key={field.key}
                            className={`flex items-center space-x-2 p-2 rounded-lg ${
                              isCompleted ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                isCompleted ? 'text-green-500' : 'text-gray-400'
                              }`}
                            />
                            <span className={`text-sm ${
                              isCompleted ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              {field.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    {profileCompletion.percentage < 100 && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => router.push('/settings')}
                          className="w-full"
                        >
                          Complete Your Profile
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Pages</p>
                      <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
                    </div>
                    <Bitcoin className="h-8 w-8 text-tiffany-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Pages</p>
                      <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
                    </div>
                    <BarChart className="h-8 w-8 text-tiffany-600" />
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Donations</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <Bitcoin className="h-8 w-8 text-tiffany-600" />
                  </div>
                </Card>
              </motion.div>

              {/* Pages Section */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Donation Pages</h2>
                <Button
                  onClick={() => router.push('/create')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create New Page
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiffany-500"></div>
                </div>
              ) : pages.length === 0 ? (
                <Card className="text-center p-8">
                  <Bitcoin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No Pages Yet</h2>
                  <p className="text-gray-600 mb-6">Create your first donation page to start accepting Bitcoin donations</p>
                  <Button
                    onClick={() => router.push('/create')}
                    className="flex items-center gap-2 mx-auto"
                  >
                    Create Your First Page
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {pages.map((page, index) => (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">{page.title}</h2>
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/dashboard/${page.id}`)}
                            >
                              View Page
                            </Button>
                          </div>
                          <p className="text-gray-600 mb-4">{page.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Created: {new Date(page.created_at).toLocaleDateString()}</span>
                            {page.lightning_address && (
                              <span>• Lightning: {page.lightning_address}</span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  )
} 