'use client'

import { useAuth } from '@/features/auth/hooks'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CreatePage() {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!user) {
      toast.error('Please sign in to create a profile')
      return
    }

    setIsCreating(true)
    try {
      // TODO: Implement profile creation
      toast.success('Profile created successfully')
    } catch (error) {
      toast.error('Failed to create profile')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Create Your Profile
            </h1>
            
            <p className="text-gray-600 mb-8">
              Set up your profile to start receiving Bitcoin donations. Add your Bitcoin address,
              write a bio, and customize your display name.
            </p>

            <div className="flex justify-end">
              <Button
                onClick={handleCreate}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 