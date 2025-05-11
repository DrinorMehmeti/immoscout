/*
  # Implement property approval system

  1. Changes
     - Update valid_status constraint to include 'pending' status
     - Add a default 'pending' status for new property listings
     - Update property RLS policy to only show 'active' properties to the public
     - Add an admin policy to view all properties including pending ones
     - Update all existing properties to ensure they have valid statuses
  
  2. Security
     - Only admins can change property status from 'pending' to 'active'
     - Public users only see active properties
*/

-- Update the valid_status constraint to include 'pending' status
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE properties
ADD CONSTRAINT valid_status
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'sold'::text, 'rented'::text, 'pending'::text, 'rejected'::text]));

-- Set default status for new properties to 'pending'
ALTER TABLE properties 
ALTER COLUMN status SET DEFAULT 'pending';

-- Update existing policy to only show active properties to the public
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;

CREATE POLICY "Anyone can view active properties" 
ON properties
FOR SELECT
TO public
USING (status = 'active');

-- Create policy for admins to view all properties
CREATE POLICY "Admins can view all properties" 
ON properties
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Create policy for admins to approve or reject properties
CREATE POLICY "Admins can update property status" 
ON properties
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Set status to 'active' for all existing properties for backward compatibility
UPDATE properties SET status = 'active' WHERE status NOT IN ('active', 'inactive', 'sold', 'rented', 'pending', 'rejected');