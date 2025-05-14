/*
  # Set all users as admins

  1. Changes
    - Updates all profiles to have admin privileges by setting is_admin = true
  
  This migration updates the is_admin column to true for all existing users in the profiles table,
  effectively granting admin rights to all users in the system.
*/

-- Update all profiles to set is_admin = true
UPDATE profiles 
SET is_admin = true;

-- Add a comment to the is_admin column to document its purpose
COMMENT ON COLUMN profiles.is_admin IS 'Flag indicating whether the user has admin privileges (true) or not (false)';