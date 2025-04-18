'use client'

import { useState, useCallback } from 'react'
import { ProfileFormData, ProfileFormErrors } from '@/types/profile'

interface UseProfileFormProps {
  initialData?: Partial<ProfileFormData>
}

interface UseProfileFormReturn {
  formData: ProfileFormData
  errors: ProfileFormErrors
  loading: boolean
  error: string | null
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  validateForm: () => boolean
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetForm: () => void
}

export function useProfileForm({ initialData }: UseProfileFormProps = {}): UseProfileFormReturn {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    display_name: '',
    ...initialData
  })

  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: ProfileFormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      display_name: ''
    })
    setErrors({})
    setError(null)
  }, [])

  return {
    formData,
    errors,
    loading,
    error,
    handleChange,
    validateForm,
    setLoading,
    setError,
    resetForm
  }
} 