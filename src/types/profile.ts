/**
 * Profile type representing a user's profile in the system.
 * This type matches the database schema and should be kept in sync with it.
 */
export type Profile = {
  id: string
  username: string
  display_name: string
  bio?: string
  bitcoin_address?: string
  lightning_address?: string
  created_at: string
  updated_at: string
}

/**
 * Type for creating a new profile
 */
export type CreateProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>

/**
 * Type for updating an existing profile
 */
export type UpdateProfile = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>

/**
 * Type for profile form data
 */
export type ProfileFormData = {
  username: string
  display_name: string
}

/**
 * Type for profile form errors
 */
export type ProfileFormErrors = {
  username?: string
  display_name?: string
} 