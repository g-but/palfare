import { supabase } from './client'
import { Profile } from '@/types/profile'
import { Database } from '@/types/database'

export const createProfile = async (profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw new Error('Failed to create profile')
  }
  return data
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    throw new Error('Failed to fetch profile')
  }
  return data
}

export const updateProfile = async (
  userId: string,
  updates: Database['public']['Tables']['profiles']['Update']
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }
  return data
}

// Export all profile-related functions from this file
export * from './profile' 