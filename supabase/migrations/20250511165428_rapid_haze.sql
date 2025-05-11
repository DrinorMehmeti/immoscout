/*
  # Add admin field to profiles table

  1. Changes
     - Add `is_admin` boolean column to the profiles table with a default value of false
     - Create an index on the `is_admin` column for more efficient queries
     
  2. Purpose
     - Allow explicit designation of administrator users
     - Support proper admin access control in the application
*/

-- Add is_admin column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Create an index on is_admin column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Update the row level security policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON profiles
  FOR SELECT 
  TO authenticated
  USING (
    (auth.uid() = id) OR 
    (
      SELECT is_admin FROM profiles WHERE id = auth.uid()
    )
  );

-- In real production environments, you might want to also create admin-specific 
-- policies for other tables to allow admins to manage content