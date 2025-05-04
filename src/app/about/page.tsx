'use client'

import { Button } from '@/components/ui/Button'
import { Bitcoin, ArrowRight, Target, Lightbulb, Rocket, GitBranch, Heart } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tiffany-50 to-white">
      <div className="container pt-32 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h1>
            <p className="text-xl text-gray-600">
              OrangeCat was born from a simple observation: accepting Bitcoin donations should be as easy as sharing a link, 
              and transparency should be accessible to everyone.
            </p>
          </div>

          <div className="space-y-16">
            {/* Mission Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tiffany-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-tiffany-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  We're building tools that make it easy for anyone - from open source developers and non-profits 
                  to content creators and individual projects - to accept Bitcoin donations while maintaining complete 
                  transparency. We believe that financial transparency and progress tracking should be accessible to all.
                </p>
                <p className="text-gray-600">
                  Our platform enables you to showcase your work, track your progress, and build trust with your 
                  supporters through verifiable metrics and real-time updates.
                </p>
              </div>
            </div>

            {/* Problem Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem We're Solving</h2>
                <p className="text-gray-600 mb-4">
                  Today, accepting Bitcoin donations is either technically complex or requires trusting third-party 
                  services that take fees and control your funds. Additionally, there's no easy way to:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Show real-time progress towards your goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Demonstrate financial transparency to your supporters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Track and showcase your impact</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Solution Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tiffany-100 flex items-center justify-center">
                <Bitcoin className="h-6 w-6 text-tiffany-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
                <p className="text-gray-600 mb-4">
                  OrangeCat provides a simple, elegant solution that puts you in control:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Create a transparent project page in minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Receive Bitcoin donations directly to your wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Track and display your progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Zero fees, no middlemen, complete control</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 mb-4">
                  This is just the beginning. We're building OrangeCat into a comprehensive platform for transparent 
                  funding and progress tracking. Here's what's coming:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Customizable KPIs and progress tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Automated financial reporting and transparency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Integration with popular platforms and tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Milestone tracking and achievement badges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-tiffany-500"></div>
                    </div>
                    <span>Community engagement and supporter recognition</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  We're committed to building the most powerful platform for transparent funding, 
                  helping everyone showcase their impact and build trust with their supporters.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <Link href="/auth?mode=register">
                <Button className="bg-tiffany-500 hover:bg-tiffany-600 text-white px-8 py-3 text-lg">
                  Start your transparent journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 