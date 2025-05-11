/*
  # Create storage bucket for property images

  1. New Storage Bucket
    - Creates a storage bucket named 'property_images' for storing property images
    - Sets appropriate security policies for authenticated users
  
  2. Security
    - Enables RLS on the bucket
    - Adds policies for authenticated users to manage their own files
*/

-- Create a new storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', false)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
CREATE POLICY "Property owners can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Property owners can update their images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Property owners can delete their images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Property images are viewable by everyone"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'property_images'
);