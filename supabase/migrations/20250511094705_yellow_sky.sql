/*
  # Storage Bucket Setup and Permissions

  1. Configuration
    - Create property-images bucket with public access
    - Configure CORS settings for the bucket
    
  2. Policies
    - DROP existing policies to prevent conflicts
    - CREATE precise policies with specific names:
      - "Authenticated users can upload images" (INSERT)
      - "Public can view images" (SELECT)
      - Update and delete permissions for owners
*/

-- Create the property-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Add CORS configuration for the bucket
UPDATE storage.buckets
SET cors_rules = '[{"allowed_origins": ["*"], "allowed_methods": ["GET", "POST", "PUT", "DELETE"], "allowed_headers": ["*"], "max_age_seconds": 3000}]'
WHERE id = 'property-images';

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Property images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Policy for authenticated users to upload files to the property-images bucket
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Policy to make property images publicly readable with exact name "Public can view images"
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Policy for users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy for users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);