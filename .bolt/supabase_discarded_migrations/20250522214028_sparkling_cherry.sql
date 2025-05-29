/*
  # Add current viewers tracking

  1. New Tables
    - `current_viewers` - Tracks users currently viewing properties
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `viewer_id` (uuid, references profiles)
      - `session_id` (text, for anonymous viewers)
      - `joined_at` (timestamp)
      - `last_active` (timestamp)
      
  2. Security
    - Enable RLS on `current_viewers` table
    - Add policies for creating and viewing current viewers
    
  3. Functions
    - Add function to update or insert viewer records
    - Add function to clean up stale viewer records
    - Add function to count current viewers for a property
*/

-- Create current_viewers table
CREATE TABLE IF NOT EXISTS current_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL, -- For both authenticated and anonymous users
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Either viewer_id OR session_id must be provided
  CONSTRAINT viewer_identification CHECK (
    (viewer_id IS NOT NULL) OR (session_id IS NOT NULL)
  ),
  
  -- Each viewer (by ID or session) can only view a property once at a time
  CONSTRAINT unique_viewer_property UNIQUE (property_id, COALESCE(viewer_id::text, ''), session_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_current_viewers_property_id ON current_viewers(property_id);
CREATE INDEX IF NOT EXISTS idx_current_viewers_viewer_id ON current_viewers(viewer_id) WHERE viewer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_current_viewers_session_id ON current_viewers(session_id);
CREATE INDEX IF NOT EXISTS idx_current_viewers_last_active ON current_viewers(last_active);

-- Enable RLS
ALTER TABLE current_viewers ENABLE ROW LEVEL SECURITY;

-- Policy for viewing current viewers - anyone can see how many viewers are on a property
CREATE POLICY "Anyone can view current viewers count"
  ON current_viewers FOR SELECT
  TO public
  USING (true);

-- Policy for adding/updating viewer status - anyone can register as viewing
CREATE POLICY "Anyone can register as viewing a property"
  ON current_viewers FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for updating last_active timestamp - viewers can update their own records
CREATE POLICY "Viewers can update their own viewing records"
  ON current_viewers FOR UPDATE
  TO public
  USING (
    (auth.uid() = viewer_id) OR 
    (session_id = current_setting('request.headers')::json->>'x-session-id', false)
  )
  WITH CHECK (
    (auth.uid() = viewer_id) OR 
    (session_id = current_setting('request.headers')::json->>'x-session-id', false)
  );

-- Function to register or update a viewer
CREATE OR REPLACE FUNCTION register_property_viewer(
  p_property_id UUID,
  p_session_id TEXT
)
RETURNS VOID AS $$
DECLARE
  v_viewer_id UUID;
  v_now TIMESTAMPTZ := now();
BEGIN
  -- Get current user ID if authenticated
  IF auth.role() = 'authenticated' THEN
    v_viewer_id := auth.uid();
  ELSE
    v_viewer_id := NULL;
  END IF;

  -- Insert or update viewer record
  INSERT INTO current_viewers (property_id, viewer_id, session_id, joined_at, last_active)
  VALUES (p_property_id, v_viewer_id, p_session_id, v_now, v_now)
  ON CONFLICT (property_id, COALESCE(viewer_id::text, ''), session_id) 
  DO UPDATE SET last_active = v_now;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up stale viewers (those inactive for more than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_stale_viewers()
RETURNS VOID AS $$
BEGIN
  DELETE FROM current_viewers
  WHERE last_active < now() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count current viewers for a property
CREATE OR REPLACE FUNCTION count_current_viewers(p_property_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- First clean up stale viewers
  PERFORM cleanup_stale_viewers();
  
  -- Then count current viewers
  SELECT COUNT(*) INTO v_count
  FROM current_viewers
  WHERE property_id = p_property_id;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled function to regularly clean up stale viewers
-- Note: This would typically be done with a cron job or similar in production
-- For Supabase, we can use pg_cron extension if available
DO $$
BEGIN
  -- Check if pg_cron is available
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    -- Create a job to run every 5 minutes
    PERFORM cron.schedule(
      'cleanup-stale-viewers',
      '*/5 * * * *',
      'SELECT cleanup_stale_viewers()'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If pg_cron is not available, this will silently fail
    -- In production, you'd want to log this or handle it differently
    NULL;
END $$;

-- Add function to get property with current viewer count
CREATE OR REPLACE FUNCTION get_property_with_viewer_count(p_property_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price NUMERIC,
  location TEXT,
  type TEXT,
  listing_type TEXT,
  current_viewers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, 
    p.title, 
    p.price, 
    p.location, 
    p.type, 
    p.listing_type,
    count_current_viewers(p.id) AS current_viewers
  FROM 
    properties p
  WHERE 
    p.id = p_property_id
  AND
    p.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;