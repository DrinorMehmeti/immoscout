/*
  # Create storage bucket for property images
  
  1. Creates a new storage bucket for property images
  2. Sets up Row Level Security (RLS)
  3. Creates policies for image upload and access
*/

-- Create a new storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create security policies to control access to the bucket
-- Allow public access to view images
CREATE POLICY "Property images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'property_images');

-- Allow authenticated users to upload images to their own folders
CREATE POLICY "Users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property_images' AND
  (auth.uid()::text = (storage.foldername(name))[1])
);

-- Allow users to update their own images
CREATE POLICY "Users can update their own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  (auth.uid()::text = (storage.foldername(name))[1])
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property_images' AND
  (auth.uid()::text = (storage.foldername(name))[1])
);