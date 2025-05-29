/*
  # Property images storage bucket setup

  1. New Storage
    - Creates a 'property_images' storage bucket for storing property images
    - Makes the bucket publicly accessible for reading images
  
  2. Security
    - Uses Supabase Storage API functions to set up proper RLS policies
    - Ensures users can only upload/modify files in their own directories
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Use Supabase's storage API to create policies
-- This avoids the "must be owner of table objects" error

-- Allow authenticated users to upload images to paths starting with their own user ID
BEGIN;
  SELECT storage.create_policy(
    'property_images', 
    'authenticated', 
    'INSERT', 
    storage.policy_condition(
      'name',
      'STARTSWITH',
      '${auth.uid()}/'
    )
  );
COMMIT;

-- Allow users to update their own files
BEGIN;
  SELECT storage.create_policy(
    'property_images', 
    'authenticated', 
    'UPDATE', 
    storage.policy_condition(
      'name',
      'STARTSWITH',
      '${auth.uid()}/'
    )
  );
COMMIT;

-- Allow users to delete their own files
BEGIN;
  SELECT storage.create_policy(
    'property_images', 
    'authenticated', 
    'DELETE', 
    storage.policy_condition(
      'name',
      'STARTSWITH',
      '${auth.uid()}/'
    )
  );
COMMIT;

-- Allow authenticated users to read any property images
BEGIN;
  SELECT storage.create_policy(
    'property_images', 
    'authenticated', 
    'SELECT', 
    storage.policy_condition('name', 'STARTSWITH', '')
  );
COMMIT;

-- Allow public to read all property images (for property listings)
BEGIN;
  SELECT storage.create_policy(
    'property_images', 
    'public', 
    'SELECT', 
    storage.policy_condition('name', 'STARTSWITH', '')
  );
COMMIT;