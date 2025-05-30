import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientErrorBoundary from '@/components/ClientErrorBoundary'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import Loading from '@/components/Loading'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { createServerClient } from '@/services/supabase/server'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { headers } from 'next/headers'
import Script from 'next/script'
import { GlobalAuthErrorBanner } from '@/components/Loading'
import { GlobalAuthLoader } from '@/components/Loading'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  
  // Get current pathname to determine if we're on an authenticated route
  const pathname = headersList.get('x-pathname') || ''
  const isAuthenticatedRoute = pathname.startsWith('/dashboard') || 
                              pathname.startsWith('/profile') || 
                              pathname.startsWith('/settings') ||
                              pathname.startsWith('/assets') ||
                              pathname.startsWith('/people') ||
                              pathname.startsWith('/events') ||
                              pathname.startsWith('/organizations') ||
                              pathname.startsWith('/projects') ||
                              pathname.startsWith('/fundraising')

  const supabase = createServerClient()
  
  // Get session and user
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  // Try to get profile data if user exists
  let profile = null
  if (user) {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!error && profileData) {
        profile = profileData
      }
    } catch (error) {
      console.log('Profile fetch error in RootLayout:', error)
    }
  }

  // Debug logs for SSR state (after profile fetch attempt)
  // console.log('SSR session after profile fetch:', session)
  // console.log('SSR user after profile fetch:', user)
  // console.log('SSR profile after profile fetch:', profile)
  // console.log('SSR headers:', Object.fromEntries(headersList.entries()))

  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        {/* Auth cleanup script removed to fix MIME errors */}
      </head>
      <body className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white safe-area-padding" suppressHydrationWarning>
        <AuthProvider user={user} session={session} profile={profile}>
          <GlobalAuthErrorBanner />
          <ClientErrorBoundary>
            <Suspense fallback={<Loading fullScreen />}>
              {/* Global loading overlay based on auth store */}
              <GlobalAuthLoader />
              <div className="min-h-screen flex flex-col">
                {/* Only show main header on public routes */}
                {!isAuthenticatedRoute && <Header />}
                <main className={`flex-grow ${!isAuthenticatedRoute ? 'pt-16 sm:pt-20' : ''}`}>
                  {children}
                </main>
                <Footer />
              </div>
            </Suspense>
          </ClientErrorBoundary>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                marginTop: '4rem',
              },
            }}
          />
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  )
} 