/*
  # Fix Storage Bucket configuration

  1. New Policies
     - Create the property-images bucket
     - Set up all required security policies with proper error handling
     - Ensure idempotent operations

  This migration ensures the storage bucket is properly created and all
  necessary policies are in place, even if previous migrations have
  partially applied some of these settings.
*/

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Apply each policy only if it doesn't already exist
DO $$
BEGIN
  -- Policy for authenticated users to upload images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images');
  END IF;

  -- Policy to make property images publicly readable
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Property images are publicly accessible'
  ) THEN
    CREATE POLICY "Property images are publicly accessible"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'property-images');
  END IF;

  -- Policy for users to update their own images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own images'
  ) THEN
    CREATE POLICY "Users can update their own images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text)
    WITH CHECK (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  -- Policy for users to delete their own images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own images'
  ) THEN
    CREATE POLICY "Users can delete their own images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;