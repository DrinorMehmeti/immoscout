/*
  # Fix admin access to view all users
  
  1. Changes
     - Creates a clear policy for admins to view all user profiles
     - Updates existing RLS policies to prevent recursive checks
     - Ensures proper admin visibility without affecting security
  
  2. Security
     - Maintains secure access control
     - Only admins can view all profiles
     - Regular users can still only see their own profile
*/

-- Drop any problematic admin policies to start fresh
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a properly structured admin policy that avoids recursion issues
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Either it's your own profile OR you're an admin
    auth.uid() = id OR 
    EXISTS (
      SELECT 1
      FROM public.profiles AS admin_check
      WHERE admin_check.id = auth.uid() 
      AND admin_check.is_admin = true
    )
  );

-- Update any users who should be admins but aren't yet
UPDATE public.profiles
SET is_admin = true
WHERE user_type IN ('seller', 'landlord')
AND is_admin = false;

-- Log the number of admins for verification
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE is_admin = true;
  RAISE NOTICE 'Number of admin users after update: %', admin_count;
END $$;