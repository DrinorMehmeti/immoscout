/*
  # Add property view tracking

  1. New Tables
    - We already have `property_views` table with:
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key to properties)
      - `viewer_id` (uuid, foreign key to users, nullable)
      - `viewed_at` (timestamp with time zone)
      - `ip_address` (text, nullable)
      - `user_agent` (text, nullable)
  
  2. Security
    - Enable RLS on property_views
    - Add policies for inserting views and property owners viewing stats
    - Add function to prevent duplicate views from same user within a time period
*/

-- Ensure the property_views table exists
CREATE TABLE IF NOT EXISTS property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewer_id ON property_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON property_views(viewed_at);

-- Enable RLS
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Create policies for property_views
-- Anyone can add a view
CREATE POLICY IF NOT EXISTS "Anyone can add a view" 
  ON property_views
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Property owners can view all views for their properties
CREATE POLICY IF NOT EXISTS "Property owners can view all views for their properties" 
  ON property_views
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_views.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

-- Create or replace function to prevent duplicate views from the same user within a time period
CREATE OR REPLACE FUNCTION check_recent_view() 
RETURNS TRIGGER AS $$
BEGIN
  -- If viewer_id is not null, check for duplicate views within the last hour
  IF NEW.viewer_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM property_views 
      WHERE property_id = NEW.property_id 
      AND viewer_id = NEW.viewer_id 
      AND viewed_at > NOW() - INTERVAL '1 hour'
    ) THEN
      RETURN NULL; -- Prevent duplicate view
    END IF;
  -- If IP address is provided but no viewer_id, check for duplicate views from same IP
  ELSIF NEW.ip_address IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM property_views 
      WHERE property_id = NEW.property_id 
      AND ip_address = NEW.ip_address 
      AND viewer_id IS NULL
      AND viewed_at > NOW() - INTERVAL '1 hour'
    ) THEN
      RETURN NULL; -- Prevent duplicate view
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists to avoid duplicates
DROP TRIGGER IF EXISTS prevent_duplicate_views ON property_views;

-- Create trigger to prevent duplicate views
CREATE TRIGGER prevent_duplicate_views
  BEFORE INSERT ON property_views
  FOR EACH ROW
  EXECUTE FUNCTION check_recent_view();

-- Create a function to get property view counts for the admin dashboard
CREATE OR REPLACE FUNCTION get_property_view_stats(property_id_param uuid, days_param int DEFAULT 30)
RETURNS TABLE (
  total_views bigint,
  unique_viewers bigint,
  recent_views bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_views,
    COUNT(DISTINCT viewer_id) as unique_viewers,
    COUNT(*) FILTER (WHERE viewed_at > NOW() - (days_param || ' days')::interval) as recent_views
  FROM property_views
  WHERE property_id = property_id_param;
END;
$$ LANGUAGE plpgsql;