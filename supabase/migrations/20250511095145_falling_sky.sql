/*
  # Create property-images storage bucket

  1. Storage
    - Create a storage bucket for property images
    - Enable public access to the bucket
  
  This migration ensures the existence of the 'property-images' storage bucket
  which is required for the image upload functionality in the properties module.
*/

-- Create the property-images bucket if it doesn't exist
SELECT CASE 
  WHEN NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'property-images'
  ) 
  THEN storage.create_bucket('property-images', 'Public bucket for property images', 'public')
END;

-- Set the security policy to allow public read access
INSERT INTO storage.policies (name, bucket_id, operation, definition)
SELECT 
  'Public Read Access', 
  id, 
  'SELECT', 
  'true'
FROM storage.buckets 
WHERE name = 'property-images'
AND NOT EXISTS (
  SELECT 1 FROM storage.policies 
  WHERE bucket_id = (SELECT id FROM storage.buckets WHERE name = 'property-images')
  AND operation = 'SELECT' AND name = 'Public Read Access'
);

-- Allow authenticated users to upload to their own folder
INSERT INTO storage.policies (name, bucket_id, operation, definition)
SELECT 
  'Authenticated users can upload', 
  id, 
  'INSERT', 
  'auth.uid() = ANY(storage.foldername(name)::text[])'
FROM storage.buckets 
WHERE name = 'property-images'
AND NOT EXISTS (
  SELECT 1 FROM storage.policies 
  WHERE bucket_id = (SELECT id FROM storage.buckets WHERE name = 'property-images')
  AND operation = 'INSERT' AND name = 'Authenticated users can upload'
);