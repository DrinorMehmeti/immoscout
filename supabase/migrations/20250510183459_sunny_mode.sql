/*
  # Create storage bucket for property images

  1. Creates a new bucket
    - `property-images` for storing property images
  2. Security
    - Public access enabled
    - Storage policies for proper access
*/

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for authenticated users to upload files to the property-images bucket
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Policy to make property images publicly readable
CREATE POLICY "Property images are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Policy for users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);