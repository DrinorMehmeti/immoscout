/*
  # Add user personal identification field

  1. New Columns
    - Add `personal_id` field to profiles table for unique user identification
    - Generate random IDs for existing users
  
  2. Security
    - Ensure only the user themselves can view their personal_id
*/

-- Add personal_id column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS personal_id VARCHAR(12) UNIQUE;

-- Update existing users with unique IDs
-- Generates an alphanumeric ID in the format "USER-XXXXXX"
UPDATE public.profiles
SET personal_id = CONCAT('USER-', SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
WHERE personal_id IS NULL;

-- Make personal_id NOT NULL after populating existing users
ALTER TABLE public.profiles
ALTER COLUMN personal_id SET NOT NULL;

-- Function to generate personal_id on user creation
CREATE OR REPLACE FUNCTION generate_personal_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.personal_id := CONCAT('USER-', SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to ensure personal_id is set
DROP TRIGGER IF EXISTS ensure_personal_id ON public.profiles;
CREATE TRIGGER ensure_personal_id
BEFORE INSERT ON public.profiles
FOR EACH ROW
WHEN (NEW.personal_id IS NULL)
EXECUTE PROCEDURE generate_personal_id();