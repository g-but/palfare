'use client'

import { useEffect, useState } from 'react'
import { 
  AlertCircle, 
  ArrowRight,
  Plus,
  Star,
  Eye,
  Handshake,
  TrendingUp,
  Users,
  Target,
  Coins,
  Calendar,
  BarChart3,
  Zap,
  Globe,
  Share2,
  Building,
  Briefcase,
  Wallet,
  Heart,
  RefreshCw,
  CheckCircle2,
  ArrowDown,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/Loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { WalletOverview } from '@/components/dashboard/WalletOverview'
import { MetricCard, MetricGrid } from '@/components/dashboard/MetricCard'
import { useAnalytics } from '@/hooks/useAnalytics'
import { analyticsService } from '@/services/analytics'
import { toast } from 'sonner'
import DraftPrompt from '@/components/dashboard/DraftPrompt'
import { useDrafts } from '@/hooks/useDrafts'

export default function DashboardPage() {
  const { user, profile, isLoading, error: authError, hydrated, session } = useAuth()
  const router = useRouter()
  const { metrics, isLoading: analyticsLoading, error: analyticsError, refresh, lastUpdated } = useAnalytics()
  const { hasAnyDraft, hasDrafts, hasLocalDraft, drafts, getPrimaryDraft, isLoading: draftsLoading } = useDrafts()
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    if (hydrated) {
      setLocalLoading(false)
    }
  }, [hydrated])

  // Handle loading states
  if (!hydrated || localLoading || draftsLoading) {
    return <Loading fullScreen />
  }

  // Handle unauthenticated state
  if (!user && !session) {
    return <Loading fullScreen />
  }

  // Show error state if there's an authentication error
  if (authError && user) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle>Error Loading Dashboard</CardTitle>
            <CardDescription>{authError}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              There was an issue loading your dashboard. Please try refreshing.
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => router.refresh()}>Refresh</Button>
              <Link href="/auth">
                <Button variant="outline">Go to Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Determine user's journey stage
  const hasUsername = profile?.username
  const hasBio = profile?.bio
  const hasBitcoinAddress = profile?.bitcoin_address
  const hasActiveCampaigns = (() => {
    const value = metrics?.fundraising?.stats?.activeCampaigns?.value
    return value ? Number(value) > 0 : false
  })()
  
  // Profile completion percentage
  const profileFields = [hasUsername, hasBio, hasBitcoinAddress]
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100)
  
  // Define smart task system
  const getNextActions = () => {
    // PRIORITY 1: Complete draft campaigns (MOST PROMINENT)
    if (hasAnyDraft) {
      const primaryDraft = getPrimaryDraft()
      
      if (primaryDraft) {
        const isDraftLocal = primaryDraft.type === 'local'
        const draftCount = hasDrafts ? drafts.length : 0
        const totalDrafts = draftCount + (hasLocalDraft ? 1 : 0)
        
        return {
          primary: {
            type: 'draft',
            title: isDraftLocal ? 'Continue Your Campaign' : 'Complete Your Campaign',
            subtitle: isDraftLocal 
              ? `Unsaved progress: "${primaryDraft.title}"` 
              : totalDrafts > 1 
                ? `${totalDrafts} draft${totalDrafts > 1 ? 's' : ''} waiting to be published`
                : `Draft: "${primaryDraft.title}"`,
            description: isDraftLocal 
              ? 'You have unsaved changes! Continue where you left off and publish your campaign to start receiving Bitcoin donations.'
              : 'You&apos;re so close! Finish your campaign and start receiving Bitcoin donations.',
            action: isDraftLocal ? 'Continue Editing' : 'Complete Campaign',
            href: '/create',
            icon: Target,
            gradient: 'from-blue-600 to-indigo-600',
            bgGradient: 'from-blue-50 to-indigo-50',
            borderColor: 'border-blue-200',
            urgent: true
          },
          secondary: hasDrafts && drafts.length > 1 ? [
            { label: `View All Drafts (${drafts.length})`, href: '/dashboard/fundraising', icon: FileText }
          ] : []
        }
      }
    }

    // PRIORITY 2: Profile setup (if incomplete)
    if (profileCompletion < 100) {
      const missingItems = []
      if (!hasUsername) missingItems.push({ label: 'Username', icon: Star })
      if (!hasBitcoinAddress) missingItems.push({ label: 'Bitcoin Address', icon: Wallet })
      if (!hasBio) missingItems.push({ label: 'Bio', icon: Heart })

      return {
        primary: {
          type: 'profile',
          title: 'Complete Your Profile',
          subtitle: `${missingItems.length} step${missingItems.length > 1 ? 's' : ''} remaining`,
          description: 'Set up your profile to start accepting Bitcoin donations from supporters worldwide.',
          action: 'Complete Profile',
          href: '/profile',
          icon: Star,
          gradient: 'from-orange-500 to-amber-500',
          bgGradient: 'from-orange-50 to-amber-50',
          borderColor: 'border-orange-200',
          missingItems
        },
        secondary: []
      }
    }

    // PRIORITY 3: Create first campaign
    if (!hasActiveCampaigns) {
      return {
        primary: {
          type: 'create',
          title: 'Create Your First Campaign',
          subtitle: 'Ready to start fundraising',
          description: 'Launch your Bitcoin-powered fundraising campaign in just a few minutes.',
          action: 'Create Campaign',
          href: '/create',
          icon: Plus,
          gradient: 'from-teal-500 to-cyan-500',
          bgGradient: 'from-teal-50 to-cyan-50',
          borderColor: 'border-teal-200'
        },
        secondary: [
          { label: 'Explore Examples', href: '/fund-others', icon: Globe }
        ]
      }
    }

    // PRIORITY 4: Growth and optimization
    return {
      primary: {
        type: 'grow',
        title: 'Grow Your Impact',
        subtitle: 'Campaign optimization',
        description: 'Share your campaigns and connect with more supporters to maximize your fundraising.',
        action: 'View Analytics',
        href: '/dashboard/fundraising',
        icon: TrendingUp,
        gradient: 'from-green-500 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-200'
      },
      secondary: [
        { label: 'Share Campaign', href: '/dashboard/fundraising', icon: Share2 },
        { label: 'View Analytics', href: '/dashboard/fundraising', icon: BarChart3 }
      ]
    }
  }

  const { primary, secondary } = getNextActions()

  // Prepare metrics for display
  const fundraisingMetrics = metrics?.fundraising ? [
    {
      icon: Target,
      iconColor: "bg-teal-100 text-teal-600",
      label: "Active Campaigns",
      metric: metrics.fundraising.stats.activeCampaigns,
      subtitle: `${metrics.fundraising.stats.totalCampaigns.value} total campaigns`
    },
    {
      icon: Coins,
      iconColor: "bg-green-100 text-green-600", 
      label: "Total Raised",
      metric: {
        ...metrics.fundraising.stats.totalRaised,
        value: analyticsService.formatCurrency(Number(metrics.fundraising.stats.totalRaised.value))
      },
      subtitle: `Avg: ${analyticsService.formatCurrency(Number(metrics.fundraising.stats.avgDonationSize.value))} per supporter`
    },
    {
      icon: Users,
      iconColor: "bg-blue-100 text-blue-600",
      label: "Total Supporters", 
      metric: metrics.fundraising.stats.totalSupporters,
      subtitle: "Across all campaigns"
    },
    {
      icon: TrendingUp,
      iconColor: "bg-purple-100 text-purple-600",
      label: "Success Rate",
      metric: metrics.fundraising.stats.successRate,
      subtitle: "Campaigns reaching goals"
    }
  ] : []

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Welcome back, {profile?.display_name || profile?.username || 'there'}! 👋
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Your Bitcoin fundraising journey continues here
        </p>
      </div>

      {/* HERO ACTION CARD - Most Prominent */}
      <Card className={`relative overflow-hidden bg-gradient-to-r ${primary.bgGradient} ${primary.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
        {primary.urgent && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
            <div className="bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full animate-pulse">
              URGENT
            </div>
          </div>
        )}
        
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Icon */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${primary.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <primary.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center lg:text-left space-y-3 w-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {primary.title}
                </h2>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {primary.subtitle}
                </p>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {primary.description}
                </p>
              </div>

              {/* Missing items for profile setup */}
              {primary.type === 'profile' && primary.missingItems && (
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {primary.missingItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-full text-sm min-h-[44px] touch-manipulation">
                      <item.icon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Action Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full">
                <Link href={primary.href} className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className={`w-full sm:w-auto bg-gradient-to-r ${primary.gradient} hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[48px] sm:min-h-[52px] touch-manipulation`}
                  >
                    {primary.action}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                  </Button>
                </Link>
                
                {/* Secondary actions */}
                {secondary.map((action, index) => (
                  <Link key={index} href={action.href} className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[52px] touch-manipulation">
                      <action.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Journey Visualization */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your Fundraising Journey</h3>
            <p className="text-sm sm:text-base text-gray-600">Track your progress through these key milestones</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto space-y-4 sm:space-y-0">
            {/* Step 1: Profile */}
            <div className="flex flex-col items-center space-y-2 min-w-0 flex-1">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${profileCompletion >= 100 ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-600'} transition-all duration-300 touch-manipulation`}>
                {profileCompletion >= 100 ? <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" /> : <Star className="w-6 h-6 sm:w-7 sm:h-7" />}
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-medium text-gray-900">Profile Setup</div>
                <div className="text-xs sm:text-sm text-gray-500">{profileCompletion}% complete</div>
              </div>
            </div>

            {/* Connector */}
            <div className={`hidden sm:flex flex-1 h-1 mx-4 rounded ${profileCompletion >= 100 ? 'bg-green-200' : 'bg-gray-200'} transition-all duration-300`}>
              <div 
                className="h-full bg-green-500 rounded transition-all duration-500" 
                style={{ width: profileCompletion >= 100 ? '100%' : '0%' }}
              />
            </div>

            {/* Mobile connector */}
            <div className={`sm:hidden w-1 h-8 mx-auto rounded ${profileCompletion >= 100 ? 'bg-green-200' : 'bg-gray-200'} transition-all duration-300`}>
              <div 
                className="w-full bg-green-500 rounded transition-all duration-500" 
                style={{ height: profileCompletion >= 100 ? '100%' : '0%' }}
              />
            </div>

            {/* Step 2: Campaign */}
            <div className="flex flex-col items-center space-y-2 min-w-0 flex-1">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${(hasActiveCampaigns || hasDrafts) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'} transition-all duration-300 touch-manipulation`}>
                {(hasActiveCampaigns || hasDrafts) ? <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" /> : <Target className="w-6 h-6 sm:w-7 sm:h-7" />}
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-medium text-gray-900">Create Campaign</div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {hasDrafts ? 'In Progress' : hasActiveCampaigns ? 'Complete' : 'Pending'}
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className={`hidden sm:flex flex-1 h-1 mx-4 rounded ${hasActiveCampaigns ? 'bg-green-200' : 'bg-gray-200'} transition-all duration-300`}>
              <div 
                className="h-full bg-green-500 rounded transition-all duration-500" 
                style={{ width: hasActiveCampaigns ? '100%' : '0%' }}
              />
            </div>

            {/* Mobile connector */}
            <div className={`sm:hidden w-1 h-8 mx-auto rounded ${hasActiveCampaigns ? 'bg-green-200' : 'bg-gray-200'} transition-all duration-300`}>
              <div 
                className="w-full bg-green-500 rounded transition-all duration-500" 
                style={{ height: hasActiveCampaigns ? '100%' : '0%' }}
              />
            </div>

            {/* Step 3: Growth */}
            <div className="flex flex-col items-center space-y-2 min-w-0 flex-1">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${hasActiveCampaigns ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'} transition-all duration-300 touch-manipulation`}>
                {hasActiveCampaigns ? <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" /> : <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />}
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-medium text-gray-900">Grow & Share</div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {hasActiveCampaigns ? 'Active' : 'Coming Soon'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Error */}
      {analyticsError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <span className="font-medium block sm:inline">Analytics Error:</span>
                <span className="block sm:inline sm:ml-1 break-words">{analyticsError}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show metrics if user has campaigns */}
      {(hasActiveCampaigns || hasDrafts) && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Fundraising Progress</h2>
            <Link href="/dashboard/fundraising" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto min-h-[44px] touch-manipulation">
                View Details <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
              </Button>
            </Link>
          </div>
          
          <MetricGrid 
            metrics={fundraisingMetrics}
            isLoading={analyticsLoading}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          />
        </div>
      )}

      {/* Wallet Overview - only show if user has Bitcoin address */}
      {hasBitcoinAddress && (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Bitcoin Wallet</h2>
          <WalletOverview walletAddress={profile?.bitcoin_address} className="gap-4 sm:gap-6" />
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group touch-manipulation" onClick={() => router.push('/profile')}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Update Profile</h3>
              <p className="text-sm sm:text-base text-gray-600">Enhance your presence</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group touch-manipulation" onClick={() => router.push('/fund-others')}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-purple-200 transition-colors">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Explore Campaigns</h3>
              <p className="text-sm sm:text-base text-gray-600">Support other projects</p>
            </CardContent>
          </Card>

          {hasActiveCampaigns && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer group touch-manipulation sm:col-span-2 lg:col-span-1" onClick={() => router.push('/dashboard/fundraising')}>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Analytics</h3>
                <p className="text-sm sm:text-base text-gray-600">Track performance</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Data freshness indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 flex-shrink-0" />
          <span className="text-center sm:text-left">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refresh}
          disabled={analyticsLoading}
          className="min-h-[44px] touch-manipulation"
        >
          {analyticsLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  )
}