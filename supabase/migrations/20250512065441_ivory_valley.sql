/*
  # Create property images storage bucket and policies

  1. New Storage Bucket
    - Creates property_images storage bucket for property images
  
  2. Storage Policies
    - Allows public access to read (view) images
    - Allows authenticated users to upload to folders with their user ID
    - Allows users to update and delete their own images only
*/

-- Check if storage schema exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata 
    WHERE schema_name = 'storage'
  ) THEN
    RAISE NOTICE 'storage schema does not exist, skipping storage bucket creation';
    RETURN;
  END IF;
  
  -- Create a new storage bucket for property images if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets 
    WHERE id = 'property_images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('property_images', 'property_images', true);
  END IF;
END $$;

-- Check if policies already exist before creating them
DO $$ 
BEGIN
  -- Check for the select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Property images are publicly accessible'
  ) THEN
    -- Allow public access to view images
    CREATE POLICY "Property images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property_images');
  END IF;
  
  -- Check for the insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload property images'
  ) THEN
    -- Allow authenticated users to upload images to their own folders
    CREATE POLICY "Users can upload property images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'property_images' AND
      (auth.uid()::text = (storage.foldername(name))[1])
    );
  END IF;
  
  -- Check for the update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update their own property images'
  ) THEN
    -- Allow users to update their own images
    CREATE POLICY "Users can update their own property images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'property_images' AND
      (auth.uid()::text = (storage.foldername(name))[1])
    );
  END IF;
  
  -- Check for the delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own property images'
  ) THEN
    -- Allow users to delete their own images
    CREATE POLICY "Users can delete their own property images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'property_images' AND
      (auth.uid()::text = (storage.foldername(name))[1])
    );
  END IF;
END $$;