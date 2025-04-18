'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { Bitcoin, Share2, Copy } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface FundPage {
  id: string
  title: string
  description: string
  mission_statement: string
  bitcoin_address: string
  lightning_address: string | null
  created_at: string
}

export default function PublicPage({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient()
  const [page, setPage] = useState<FundPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data, error } = await supabase
          .from('fund_pages')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setPage(data)
      } catch (error) {
        console.error('Error fetching page:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [supabase, params.id])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiffany-500"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The donation page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-b from-white to-gray-50">
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
              <p className="text-xl text-gray-600">{page.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mission Statement</h2>
                  <p className="text-gray-600 mb-8">{page.mission_statement}</p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Bitcoin Address</h3>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                          {page.bitcoin_address}
                        </code>
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(page.bitcoin_address)}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    {page.lightning_address && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Lightning Address</h3>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                            {page.lightning_address}
                          </code>
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(page.lightning_address!)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="pt-6">
                      <Button
                        onClick={() => {
                          const url = window.location.href
                          navigator.clipboard.writeText(url)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Share2 className="h-5 w-5" />
                        {copied ? 'Link Copied!' : 'Share This Page'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
} 