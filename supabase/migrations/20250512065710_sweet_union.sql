/*
  # Create property images storage bucket with proper RLS policies

  1. Storage Setup
    - Creates 'property_images' bucket if it doesn't already exist
    - Sets the bucket to public for read access
    
  2. Security
    - Enables RLS policies for accessing, uploading, updating and deleting images
    - Ensures users can only manage their own images (based on folder structure)
    - Allows public read access to all images
*/

-- First check if the storage schema exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata 
    WHERE schema_name = 'storage'
  ) THEN
    RAISE NOTICE 'Storage schema does not exist. This migration might be running on a database without storage extension.';
    RETURN;
  END IF;
  
  -- Create property_images bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets 
    WHERE id = 'property_images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('property_images', 'property_images', true);
    RAISE NOTICE 'Created property_images bucket';
  ELSE
    RAISE NOTICE 'property_images bucket already exists';
  END IF;
END $$;

-- Set up RLS policies for the bucket
DO $$ 
BEGIN
  -- Check if storage schema exists first
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata 
    WHERE schema_name = 'storage'
  ) THEN
    RAISE NOTICE 'Storage schema does not exist, skipping policy creation';
    RETURN;
  END IF;

  -- SELECT policy - Allow public access to view property images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage' 
      AND policyname = 'Property images are publicly accessible'
  ) THEN
    CREATE POLICY "Property images are publicly accessible"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'property_images');
    
    RAISE NOTICE 'Created SELECT policy for property_images bucket';
  END IF;

  -- INSERT policy - Allow authenticated users to upload to their own folders
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage' 
      AND policyname = 'Users can upload property images'
  ) THEN
    CREATE POLICY "Users can upload property images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'property_images' AND
        (auth.uid()::text = (storage.foldername(name))[1])
      );
    
    RAISE NOTICE 'Created INSERT policy for property_images bucket';
  END IF;

  -- UPDATE policy - Allow users to update their own images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage' 
      AND policyname = 'Users can update their own property images'
  ) THEN
    CREATE POLICY "Users can update their own property images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'property_images' AND
        (auth.uid()::text = (storage.foldername(name))[1])
      );
    
    RAISE NOTICE 'Created UPDATE policy for property_images bucket';
  END IF;

  -- DELETE policy - Allow users to delete their own images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage' 
      AND policyname = 'Users can delete their own property images'
  ) THEN
    CREATE POLICY "Users can delete their own property images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'property_images' AND
        (auth.uid()::text = (storage.foldername(name))[1])
      );
    
    RAISE NOTICE 'Created DELETE policy for property_images bucket';
  END IF;
END $$;