/*
  # Set up property images storage bucket

  1. New Storage
    - Creates a public storage bucket for property images
  2. Notes
    - Storage policies need to be configured in the Supabase dashboard
    - The bucket is created with public access enabled
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

/* 
  IMPORTANT: After applying this migration, you must set up the following
  policies through the Supabase Dashboard:

  1. Allow authenticated users to upload files to their own folder:
     Policy name: "Users can upload property images"
     Operation: INSERT
     For: authenticated users
     Using expression: storage.foldername(name)[1] = auth.uid()::text

  2. Allow users to update only their own files:
     Policy name: "Users can update property images"
     Operation: UPDATE
     For: authenticated users
     Using expression: storage.foldername(name)[1] = auth.uid()::text

  3. Allow users to delete only their own files:
     Policy name: "Users can delete property images"
     Operation: DELETE
     For: authenticated users
     Using expression: storage.foldername(name)[1] = auth.uid()::text

  4. Allow public access to view all files:
     Policy name: "Public can view property images"
     Operation: SELECT
     For: public
     Using expression: true
*/