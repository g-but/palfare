'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { Bitcoin, ArrowRight, Settings } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { debounce } from 'lodash'

interface FormData {
  title: string
  description: string
  mission_statement: string
  bitcoin_address: string
  lightning_address: string
}

interface FormErrors {
  title?: string
  bitcoin_address?: string
  lightning_address?: string
  submit?: string
}

// Updated Bitcoin address regex to handle both standard addresses and Bitcoin URIs
const BITCOIN_ADDRESS_REGEX = /^(bitcoin:)?(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}(?:\?.*)?$/
const LIGHTNING_ADDRESS_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function CreatePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    mission_statement: '',
    bitcoin_address: '',
    lightning_address: '',
  })

  const validateField = useCallback((field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required'
        if (value.length < 3) return 'Title must be at least 3 characters'
        if (value.length > 100) return 'Title must be less than 100 characters'
        break
      case 'bitcoin_address':
        if (!value.trim()) return 'Bitcoin address is required'
        // Extract the address part from Bitcoin URI if present
        const address = value.startsWith('bitcoin:') 
          ? value.split('?')[0].replace('bitcoin:', '')
          : value
        if (!BITCOIN_ADDRESS_REGEX.test(value)) return 'Invalid Bitcoin address format'
        break
      case 'lightning_address':
        if (value && !LIGHTNING_ADDRESS_REGEX.test(value)) {
          return 'Invalid Lightning address format'
        }
        break
    }
    return undefined
  }, [])

  const debouncedValidate = useMemo(
    () => debounce((field: keyof FormData, value: string) => {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }, 300),
    [validateField]
  )

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    debouncedValidate(field, value)
  }, [debouncedValidate])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field as keyof FormData, value)
      if (error) {
        newErrors[field as keyof FormErrors] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [formData, validateField])

  const isFormValid = useMemo(() => {
    return formData.title.trim() !== '' && 
           formData.bitcoin_address.trim() !== '' && 
           !errors.title && 
           !errors.bitcoin_address
  }, [formData, errors])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      // Check if profile exists, create if it doesn't
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (profileError && profileError.code === 'PGRST116') { // No rows returned
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            display_name: user.user_metadata?.full_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (createError) {
          console.error('Profile creation error:', createError)
          throw new Error('Failed to create profile: ' + createError.message)
        }
        
        profile = newProfile
      } else if (profileError) {
        console.error('Profile error:', profileError)
        throw new Error('Failed to fetch profile: ' + profileError.message)
      }
      
      if (!profile) {
        throw new Error('Profile not found')
      }
      
      // Extract the address part from Bitcoin URI if present
      const bitcoinAddress = formData.bitcoin_address.startsWith('bitcoin:')
        ? formData.bitcoin_address.split('?')[0].replace('bitcoin:', '')
        : formData.bitcoin_address
      
      const { data: fundPage, error: insertError } = await supabase
        .from('fund_pages')
        .insert({
          user_id: profile.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          mission_statement: formData.mission_statement.trim(),
          bitcoin_address: bitcoinAddress,
          lightning_address: formData.lightning_address.trim(),
          is_public: true
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error('Failed to create page: ' + insertError.message)
      }
      
      if (!fundPage) {
        throw new Error('No data returned after insert')
      }
      
      router.push(`/dashboard/${fundPage.id}`)
    } catch (error) {
      console.error('Error creating fund page:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to create donation page. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Create Donation Page
                </h1>
                <p className="text-xl text-gray-600">
                  Set up your Bitcoin donation page in minutes
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card
                  title="Page Settings"
                  className="shadow-lg"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        {submitError}
                      </div>
                    )}

                    <Input
                      id="title"
                      label="Page Title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter a title for your donation page"
                      required
                      error={errors.title}
                    />

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Tell people about your cause"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-tiffany-500 focus:ring-2 focus:ring-tiffany-500/20 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="mission_statement" className="block text-sm font-medium text-gray-700 mb-2">
                        Mission Statement
                      </label>
                      <textarea
                        id="mission_statement"
                        value={formData.mission_statement}
                        onChange={(e) => handleChange('mission_statement', e.target.value)}
                        placeholder="What is your mission?"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-tiffany-500 focus:ring-2 focus:ring-tiffany-500/20 transition-colors"
                      />
                    </div>

                    <Input
                      id="bitcoin_address"
                      label="Bitcoin Address"
                      value={formData.bitcoin_address}
                      onChange={(e) => handleChange('bitcoin_address', e.target.value)}
                      placeholder="Enter your Bitcoin address"
                      required
                      error={errors.bitcoin_address}
                    />

                    <Input
                      id="lightning_address"
                      label="Lightning Address (Optional)"
                      value={formData.lightning_address}
                      onChange={(e) => handleChange('lightning_address', e.target.value)}
                      placeholder="Enter your Lightning address"
                      error={errors.lightning_address}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !isFormValid}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </div>
                      ) : (
                        <>
                          Create Page
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  )
} 