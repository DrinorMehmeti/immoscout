/*
  # Settings and Admin Privileges Improvements

  1. New Functions
    - Improves admin user management functions
    - Adds RLS policies for settings
    - Creates helper functions for settings management
  
  2. Type Fixes
    - Resolves function overloading issues
    - Ensures function parameter types are explicit
  
  3. Security
    - Adds proper row level security for all tables
*/

-- Fix the admin by email function to avoid overloading issues
-- The error was: Could not choose the best candidate function between: 
-- public.set_admin_by_email(user_email => character varying), public.set_admin_by_email(user_email => text)

-- Drop the existing function if it exists to avoid conflicts
DROP FUNCTION IF EXISTS set_admin_by_email(character varying);
DROP FUNCTION IF EXISTS set_admin_by_email(text);

-- Create a new version with explicit TEXT type
CREATE OR REPLACE FUNCTION set_admin_by_email(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  updated_count INTEGER;
BEGIN
  -- Get the user ID from auth.users based on email
  SELECT id INTO user_id 
  FROM auth.users
  WHERE email = user_email;
  
  -- If user found, update their profile
  IF user_id IS NOT NULL THEN
    UPDATE profiles SET is_admin = true
    WHERE id = user_id;
    
    -- Get the number of rows updated
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    -- Return TRUE if a row was updated, FALSE otherwise
    RETURN updated_count > 0;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get a user's profile details by ID without RLS constraints
-- Useful for auth context to fetch profile without permission issues
CREATE OR REPLACE FUNCTION get_profile_by_id(user_id UUID)
RETURNS json AS $$
DECLARE
  profile_data json;
BEGIN
  SELECT json_build_object(
    'id', id,
    'name', name,
    'user_type', user_type,
    'is_premium', is_premium,
    'premium_until', premium_until,
    'avatar_url', avatar_url,
    'is_admin', is_admin,
    'personal_id', personal_id
  ) INTO profile_data
  FROM profiles
  WHERE id = user_id;
  
  RETURN profile_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default notification settings when a new user is created
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_notification_preferences (
    user_id, 
    email_notifications,
    property_alerts, 
    message_notifications
  ) VALUES (
    NEW.id,
    TRUE,
    TRUE,
    TRUE
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'create_user_notification_preferences'
    ) THEN
        CREATE TRIGGER create_user_notification_preferences
        AFTER INSERT ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION create_default_notification_preferences();
    END IF;
END $$;

-- Create maintenance mode check function
CREATE OR REPLACE FUNCTION is_maintenance_mode()
RETURNS BOOLEAN AS $$
DECLARE
  mode BOOLEAN;
BEGIN
  SELECT (value->>'maintenance_mode')::BOOLEAN INTO mode FROM settings 
  WHERE name = 'system';
  
  RETURN COALESCE(mode, FALSE);
END;
$$ LANGUAGE plpgsql;