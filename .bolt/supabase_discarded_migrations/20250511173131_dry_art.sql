/*
  # Create property_images storage bucket

  1. Storage
    - Create a new storage bucket called `property_images` for property listing images
  
  2. Security
    - Enable public access to read files (view property images)
    - Allow authenticated users to upload files to their own folder
    - Allow users to manage (update/delete) their own images
*/

-- Create the property_images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public access to read all files in the bucket
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Public Read Access',
  '(bucket_id = ''property_images''::text)',
  'property_images'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Policy: Allow authenticated users to upload files to their own folder
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Auth Users Can Upload',
  '(bucket_id = ''property_images''::text) AND (auth.role() = ''authenticated''::text) AND (storage.foldername(name))[1] = auth.uid()::text',
  'property_images'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Policy: Allow users to manage (update/delete) their own files
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Auth Users Can Manage Own Files',
  '(bucket_id = ''property_images''::text) AND (auth.role() = ''authenticated''::text) AND (storage.foldername(name))[1] = auth.uid()::text',
  'property_images'
)
ON CONFLICT (name, bucket_id) DO NOTHING;