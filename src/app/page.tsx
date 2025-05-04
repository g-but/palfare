'use client'

import { useAuth } from '@/features/auth/hooks'
import { Button } from '@/components/ui/Button'
import { Bitcoin, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white">
      <div className="container pt-32 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Accept Bitcoin Donations</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The easiest way to
            <br />
            <span className="text-tiffany-600">accept Bitcoin donations</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your donation page in minutes. Receive Bitcoin directly to your wallet with zero fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth?mode=register">
              <Button className="bg-tiffany-500 hover:bg-tiffany-600 text-white px-8 py-3 text-lg">
                Create your page
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="px-8 py-3 text-lg">
                See who's using it
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-orange-500" />
              <span>Direct to Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-orange-500" />
              <span>No Middlemen</span>
            </div>
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-orange-500" />
              <span>Zero Fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 