'use client'

import { useAuth } from '@/features/auth/hooks'
import { useUser } from '@/features/profile/hooks'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { useState, ChangeEvent, FormEvent } from 'react'
import { toast } from 'sonner'

export default function ProfileSettingsPage() {
  const { user: currentUser } = useAuth()
  const { user, update, loading } = useUser(currentUser?.id || '')
  const [formData, setFormData] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    bitcoin_address: user?.bitcoin_address || ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const result = await update(formData)
      if (result.success) {
        toast.success('Profile updated successfully')
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiffany-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="display_name"
                label="Display Name"
                value={formData.display_name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, display_name: e.target.value })
                }
                required
              />

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <Input
                id="bitcoin_address"
                label="Bitcoin Address"
                value={formData.bitcoin_address}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, bitcoin_address: e.target.value })
                }
                placeholder="bc1..."
                description="Add your Bitcoin address to receive donations"
              />

              <div className="flex justify-end">
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 