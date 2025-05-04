-- Migration: slim down profiles table for MVP
BEGIN;

-- Add comments to document the table
COMMENT ON TABLE public.profiles IS 'User profiles with essential information for the MVP';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN public.profiles.display_name IS 'User''s display name (previously username)';
COMMENT ON COLUMN public.profiles.bio IS 'User''s biography or description';
COMMENT ON COLUMN public.profiles.created_at IS 'Timestamp when the profile was created';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp when the profile was last updated';

-- 1) Rename username → display_name (preserves existing data)
ALTER TABLE public.profiles
  RENAME COLUMN username TO display_name;

-- Ensure display_name is NOT NULL (handle existing NULL values)
UPDATE public.profiles
SET display_name = 'Anonymous'
WHERE display_name IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN display_name SET NOT NULL;

-- 2) Drop unused columns
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS full_name,
  DROP COLUMN IF EXISTS website,
  DROP COLUMN IF EXISTS bitcoin_address,
  DROP COLUMN IF EXISTS lightning_address;

-- 3) Add new MVP fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- 4) Ensure `updated_at` trigger exists
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- 5) Create index on display_name for faster lookups
CREATE INDEX IF NOT EXISTS profiles_display_name_idx ON public.profiles(display_name);

-- 6) RLS: adjust policies for slimmed-down table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public can read any profile
CREATE POLICY IF NOT EXISTS "Public can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can only update their own
CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING ( auth.uid() = id );

COMMIT; 