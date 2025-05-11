/*
  # Fix admin redirection

  1. Sets is_admin flag for seller and landlord user types
  2. Ensures proper admin identification
*/

-- First, update existing users to set is_admin=true for sellers and landlords
UPDATE profiles
SET is_admin = true
WHERE user_type IN ('seller', 'landlord')
AND is_admin = false;

-- Create a database trigger to automatically set is_admin 
-- whenever a profile is created or updated
CREATE OR REPLACE FUNCTION set_admin_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_type IN ('seller', 'landlord') THEN
    NEW.is_admin := true;
  ELSE
    NEW.is_admin := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS set_admin_on_profile_change ON profiles;

-- Create the trigger
CREATE TRIGGER set_admin_on_profile_change
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_admin_status();