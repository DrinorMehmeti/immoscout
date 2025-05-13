/*
  # Create property_images storage bucket with appropriate RLS policies

  1. Changes
    - Create the property_images storage bucket if it doesn't exist
    - Enable RLS on the bucket
    - Add policy allowing authenticated users to upload images to their own folder structure
    - Add policy allowing authenticated users to read their own images
    - Add policy allowing public access to read images

  2. Security
    - Enable RLS on property_images bucket
    - Ensure authenticated users can only upload to paths that start with their own user ID
    - Allow public read access to all images (for displaying property listings)
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'property_images';

-- Make sure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload images to paths starting with their own user ID
CREATE POLICY "Users can upload property images to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update/delete their own files
CREATE POLICY "Users can update their own property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'property_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read any property images
CREATE POLICY "Authenticated users can read all property images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'property_images'
);

-- Allow public to read all property images (for property listings)
CREATE POLICY "Public can read all property images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'property_images'
);