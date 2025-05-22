/*
  # Add contact_requests table for property inquiries

  1. New Tables
    - `contact_requests`: Stores inquiries from users to property owners
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `requester_id` (uuid, references profiles)
      - `owner_id` (uuid, references profiles)
      - `message` (text)
      - `contact_type` (text, enum)
      - `status` (text, enum)
      - `phone_number` (text, optional)
      - `email` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `response_message` (text, optional)
  
  2. Security
    - Enable RLS on `contact_requests` table
    - Add policies for property owners to view and update requests for their properties
    - Add policies for requesters to create and view their own requests
*/

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  phone_number TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  response_message TEXT,
  
  -- Check constraints for enumerated types
  CONSTRAINT valid_contact_type CHECK (contact_type = ANY (ARRAY['viewing', 'question', 'offer', 'other'])),
  CONSTRAINT valid_status CHECK (status = ANY (ARRAY['pending', 'accepted', 'rejected', 'completed']))
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_contact_requests_property_id ON contact_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_requester_id ON contact_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_owner_id ON contact_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);

-- Add trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_requests_timestamp
BEFORE UPDATE ON contact_requests
FOR EACH ROW
EXECUTE FUNCTION update_contact_requests_updated_at();

-- Create trigger function to notify owner when a new contact request is created
CREATE OR REPLACE FUNCTION notify_owner_of_contact_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a notification for the property owner
  INSERT INTO notifications (user_id, title, message, type, property_id)
  VALUES (
    NEW.owner_id,
    'New contact request',
    'Someone is interested in your property and has sent you a message',
    'contact_request',
    NEW.property_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER create_notification_on_contact_request
AFTER INSERT ON contact_requests
FOR EACH ROW
EXECUTE FUNCTION notify_owner_of_contact_request();

-- Enable Row Level Security
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to create their own contact requests
CREATE POLICY "Users can create their own contact requests"
ON contact_requests FOR INSERT
TO authenticated
WITH CHECK (requester_id = auth.uid());

-- Policy for users to view their own contact requests (as requesters)
CREATE POLICY "Users can view their own contact requests"
ON contact_requests FOR SELECT
TO authenticated
USING (requester_id = auth.uid());

-- Policy for property owners to view contact requests for their properties
CREATE POLICY "Property owners can view contact requests for their properties"
ON contact_requests FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

-- Policy for property owners to update (respond to) contact requests for their properties
CREATE POLICY "Property owners can update contact requests for their properties"
ON contact_requests FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Create function to check if user owns a property
CREATE OR REPLACE FUNCTION user_owns_property(property_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  property_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM properties 
    WHERE id = property_id AND owner_id = auth.uid()
  ) INTO property_exists;
  
  RETURN property_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to get contact requests for a specific property
CREATE OR REPLACE FUNCTION get_property_contact_requests(p_property_id UUID)
RETURNS SETOF contact_requests AS $$
BEGIN
  IF user_owns_property(p_property_id) THEN
    RETURN QUERY
    SELECT * FROM contact_requests
    WHERE property_id = p_property_id
    ORDER BY created_at DESC;
  ELSE
    RAISE EXCEPTION 'You do not have permission to view these contact requests';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;