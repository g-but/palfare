'use client'

import { useState } from 'react'
import { useProfile } from '../hooks'
import { ProfileFormData } from '../types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Loader2, Save } from 'lucide-react'
import clsx from 'clsx'

export function ProfileForm() {
  const { profile, loading, error, update } = useProfile()
  const [formData, setFormData] = useState<ProfileFormData>({
    display_name: profile?.display_name || '',
    bio: profile?.bio || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await update(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Display Name"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          required
        />
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiffany-500 focus:border-transparent"
            rows={4}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className={clsx(
            'px-6 py-3 rounded-xl font-medium transition-all duration-200',
            'bg-tiffany-100 text-tiffany-700 hover:bg-tiffany-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2',
            'shadow-sm hover:shadow-md active:shadow-sm',
            'transform hover:-translate-y-0.5 active:translate-y-0',
            'border border-tiffany-200 hover:border-tiffany-300'
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
} 