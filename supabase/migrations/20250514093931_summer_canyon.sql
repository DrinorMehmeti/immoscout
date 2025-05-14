/*
  # Fix admin status function and update users

  1. Database Updates
    - Set is_admin=TRUE for all users with user_type='seller' or 'landlord'
    - Ensure all users have a valid personal_id

  2. Admin Functions
    - Replace existing admin status functions with improved versions
    - Add new function to set admin by UUID directly
    - Corrected error handling and diagnostics in all functions

  3. Security
    - Add constraint to enforce valid admin status
*/

-- Directly update all sellers and landlords to be admins
UPDATE public.profiles
SET is_admin = TRUE
WHERE user_type IN ('seller', 'landlord');

-- Make sure all users have a valid personal ID
UPDATE public.profiles
SET personal_id = CONCAT('USER-', SUBSTRING(MD5(id::TEXT) FROM 1 FOR 6))
WHERE personal_id IS NULL OR personal_id = '';

-- Function for setting admin by personal_id
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_personal_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Debug logging
  RAISE NOTICE 'Setting admin privileges for user with personal_id: %', user_personal_id;

  -- Update the user's admin status
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE personal_id = user_personal_id;
  
  -- Get number of affected rows
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Log the result
  RAISE NOTICE 'Updated % rows for personal_id %', affected_rows, user_personal_id;
  
  -- Return TRUE if at least one row was updated
  RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for setting admin by email
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  affected_rows INTEGER;
BEGIN
  -- Debug logging
  RAISE NOTICE 'Setting admin privileges for user with email: %', user_email;

  -- Find user ID from email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  -- Return false if user not found
  IF user_id IS NULL THEN
    RAISE NOTICE 'No user found with email %', user_email;
    RETURN FALSE;
  END IF;
  
  -- Update the profile
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE id = user_id;
  
  -- Get number of affected rows
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Log the result
  RAISE NOTICE 'Updated % rows for user_id % with email %', affected_rows, user_id, user_email;
  
  -- Return TRUE if at least one row was updated
  RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for setting admin directly with UUID
CREATE OR REPLACE FUNCTION public.set_admin_by_uuid(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Debug logging
  RAISE NOTICE 'Setting admin privileges for user with UUID: %', user_id;

  -- Update the profile
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE id = user_id;
  
  -- Get number of affected rows
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Log the result
  RAISE NOTICE 'Updated % rows for user_id %', affected_rows, user_id;
  
  -- Return TRUE if at least one row was updated
  RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update all seller/landlord users to admin
CREATE OR REPLACE FUNCTION public.update_all_seller_landlord_to_admin()
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Update the profiles
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE user_type IN ('seller', 'landlord');
  
  -- Get number of affected rows
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Log the result
  RAISE NOTICE 'Updated % users to admin status', affected_rows;
  
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a constraint to ensure valid admin status
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS valid_admin_status;

ALTER TABLE public.profiles
ADD CONSTRAINT valid_admin_status CHECK (is_admin IN (TRUE, FALSE));

-- Run the function to make sure all appropriate users are admins
SELECT public.update_all_seller_landlord_to_admin();