/*
  # Fix infinite recursion in profiles RLS policy

  1. Changes
     - Drop ALL existing policies for the profiles table
     - Create simple, non-recursive policies
     - Add separate policies for each operation (SELECT, INSERT, UPDATE)
  
  2. Security
     - Users can view their own profile
     - Users can insert their own profile
     - Users can update their own profile
     - Admins can view all profiles using a non-recursive check
*/

-- Drop ALL existing policies for the profiles table to start fresh
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a simple policy for users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create a policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create a policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a separate admin policy that uses a JWT claim approach
-- This avoids the recursive query problem
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Either viewing own profile OR user is an admin based on JWT claim
    (auth.uid() = id) OR (auth.jwt() ->> 'is_admin' = 'true')
  );