/*
  # Fix storage bucket for property images
  
  1. Changes
    - Create property_images storage bucket if it doesn't exist
    - Add storage policies with proper existence checks
  2. Security
    - Allow public access for viewing property images
    - Restrict upload/update/delete operations to authenticated users' own folders
*/

-- Create a new storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Check if the policy exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Property images are publicly accessible'
    ) THEN
        -- Allow public access to view images
        CREATE POLICY "Property images are publicly accessible"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'property_images');
    END IF;
END $$;

-- Check if the policy exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
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
END $$;

-- Check if the policy exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
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
END $$;

-- Check if the policy exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
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