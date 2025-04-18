'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/contexts/ProfileContext'
import { createProfile } from '@/lib/supabase/profile'
import { useProfileForm } from '@/hooks/useProfileForm'
import { ProfileFormData } from '@/types/profile'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export function CreateProfileForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { refreshProfile } = useProfile()
  const {
    formData,
    errors,
    loading,
    error,
    handleChange,
    validateForm,
    setLoading,
    setError
  } = useProfileForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    try {
      setLoading(true)
      setError(null)

      const profileData: ProfileFormData = {
        username: formData.username,
        display_name: formData.display_name
      }

      await createProfile(profileData)
      await refreshProfile()
      router.push('/dashboard')
    } catch (err) {
      console.error('Error creating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to create profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Create Your Profile" subtitle="Set up your profile to start accepting Bitcoin donations">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Choose a unique username"
          required
        />

        <Input
          label="Display Name (Optional)"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          error={errors.display_name}
          placeholder="Enter your display name"
        />

        <Button
          type="submit"
          isLoading={loading}
          disabled={loading}
        >
          Create Profile
        </Button>
      </form>
    </Card>
  )
} 