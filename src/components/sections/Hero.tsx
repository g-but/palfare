'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Bitcoin, ArrowRight } from 'lucide-react'

export default function Hero() {
  const router = useRouter()

  return (
    <div className="relative bg-gradient-to-b from-tiffany-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-grid-tiffany-500/[0.05] bg-grid-pattern" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
              <Bitcoin className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            <span className="block">Accept Bitcoin</span>
            <span className="block text-tiffany-500">Donations</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Create your personalized donation page in minutes. No technical knowledge required. 
            Start receiving Bitcoin donations directly to your wallet today.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/auth?mode=register')}
              size="lg"
              className="bg-tiffany-500 hover:bg-tiffany-600 text-white"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => router.push('/browse')}
              variant="outline"
              size="lg"
              className="text-tiffany-500 hover:bg-tiffany-50"
            >
              Browse Examples
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 