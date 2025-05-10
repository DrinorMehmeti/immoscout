/*
  # Create property-images bucket with proper policies

  1. Operations
    - Create the property-images bucket if it doesn't exist
    - Create all necessary storage policies with safety checks
  2. Security
    - Allow authenticated users to upload images
    - Make property images publicly readable
    - Allow users to update and delete only their own images
*/

-- Create the property-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies only if they don't exist
DO $$
BEGIN
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
END $$;

DO $$
BEGIN
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
END $$;

DO $$
BEGIN
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
END $$;

DO $$
BEGIN
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