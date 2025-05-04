'use client'

import { Button } from '@/components/ui/Button'
import { ArrowRight, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white">
      <div className="container pt-32 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            <span>Our Blog</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Coming Soon
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Hey there! We're working on something special for you. Our blog will be your go-to place for:
          </p>

          <div className="space-y-4 mb-12 text-left">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-tiffany-500"></div>
              </div>
              <p className="text-gray-600">Tips and best practices for accepting Bitcoin donations</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-tiffany-500"></div>
              </div>
              <p className="text-gray-600">Success stories from creators using OrangeCat</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-tiffany-500"></div>
              </div>
              <p className="text-gray-600">Updates about new features and improvements</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-tiffany-500"></div>
              </div>
              <p className="text-gray-600">Insights about Bitcoin and the future of digital payments</p>
            </div>
          </div>

          <p className="text-xl text-gray-600 mb-8">
            While we're putting the finishing touches on our blog, why not check out what others are doing with OrangeCat?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about">
              <Button className="bg-tiffany-500 hover:bg-tiffany-600 text-white px-8 py-3 text-lg">
                Learn about us
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Browse creators
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 