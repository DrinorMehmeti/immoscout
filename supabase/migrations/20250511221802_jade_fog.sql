/*
  # Create Storage Bucket and Policies for Property Images
  
  1. Storage Setup
    - Creates a 'property_images' storage bucket if it doesn't exist
  
  2. Security
    - Sets up policies for public access to view property images
    - Allows authenticated users to upload, update, and delete their own images
  
  This migration uses conditional checks to prevent errors when policies already exist.
*/

-- Create a new storage bucket for property images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'property_images', 'property_images', true
WHERE NOT EXISTS (
    SELECT 1
    FROM storage.buckets
    WHERE id = 'property_images'
);

-- Create security policies to control access to the bucket
-- Allow public access to view images, but only if the policy doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Property images are publicly accessible' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Property images are publicly accessible"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'property_images');
    END IF;
END$$;

-- Allow authenticated users to upload images to their own folders, but only if the policy doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload property images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Users can upload property images"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
          bucket_id = 'property_images' AND
          (auth.uid()::text = (storage.foldername(name))[1])
        );
    END IF;
END$$;

-- Allow users to update their own images, but only if the policy doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own property images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Users can update their own property images"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (
          bucket_id = 'property_images' AND
          (auth.uid()::text = (storage.foldername(name))[1])
        );
    END IF;
END$$;

-- Allow users to delete their own images, but only if the policy doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own property images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Users can delete their own property images"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (
          bucket_id = 'property_images' AND
          (auth.uid()::text = (storage.foldername(name))[1])
        );
    END IF;
END$$;