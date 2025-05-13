/*
  # Storage setup for property images

  1. New Storage
    - Creates property_images bucket if it doesn't exist
    - Sets up RLS policies for the bucket with proper existence checks

  2. Security
    - Public read access for all property images
    - Authenticated users can upload/update/delete only their own images
    - Path format enforced: userId/propertyId/filename
*/

-- Create a new storage bucket for property images if it doesn't exist
DO $$
BEGIN
    -- First check if storage schema exists (handles first-time setup)
    IF EXISTS (
        SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage'
    ) THEN
        -- Check if bucket exists
        IF NOT EXISTS (
            SELECT 1 FROM storage.buckets WHERE id = 'property_images'
        ) THEN
            INSERT INTO storage.buckets (id, name, public)
            VALUES ('property_images', 'property_images', true);
        END IF;
    END IF;
END $$;

-- Check and create policies with existence checks
DO $$
BEGIN
    -- Only proceed if storage schema exists
    IF EXISTS (
        SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage'
    ) THEN
        -- Policy 1: Public read access
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' 
            AND schemaname = 'storage' 
            AND policyname = 'Property images are publicly accessible'
        ) THEN
            CREATE POLICY "Property images are publicly accessible"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'property_images');
        END IF;

        -- Policy 2: Upload permissions
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
        END IF;

        -- Policy 3: Update permissions
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
        END IF;

        -- Policy 4: Delete permissions
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
        END IF;
    END IF;
END $$;