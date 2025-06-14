/*
  # Create settings tables and functions

  1. New Tables
    - `settings` - Stores site-wide configuration settings
    - `user_notification_preferences` - Stores user notification preferences
  
  2. Functions
    - `get_setting(setting_name TEXT)` - Get a specific setting value
    - `update_setting(setting_name TEXT, setting_value JSONB)` - Update a specific setting
  
  3. Security
    - Enable RLS on the settings table
    - Add policy for administrators to read/write settings
    - Enable RLS on user_notification_preferences
    - Add policy for users to manage their own notification preferences
*/

-- Create the settings table for site-wide configuration
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable row level security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Only administrators can read and write settings
CREATE POLICY "Administrators can read settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Administrators can update settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Functions for managing settings
CREATE OR REPLACE FUNCTION get_setting(setting_name TEXT)
RETURNS JSONB AS $$
DECLARE
  setting_value JSONB;
BEGIN
  SELECT value INTO setting_value FROM settings WHERE name = setting_name;
  RETURN setting_value;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_setting(setting_name TEXT, setting_value JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- Check if the setting exists
  IF EXISTS (SELECT 1 FROM settings WHERE name = setting_name) THEN
    -- Update the existing setting
    UPDATE settings SET value = setting_value, updated_at = now() WHERE name = setting_name;
  ELSE
    -- Insert a new setting
    INSERT INTO settings (name, value) VALUES (setting_name, setting_value);
  END IF;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user notification preferences table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  property_alerts BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  newsletter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable row level security
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own notification preferences
CREATE POLICY "Users can view their own notification preferences"
  ON user_notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON user_notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON user_notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert default settings
INSERT INTO settings (name, value, description)
VALUES 
  ('site', '{"name": "RealEstate Kosovo", "description": "Platforma më e madhe e patundshmërive në Kosovë", "contact_email": "info@realestate-kosovo.com", "contact_phone": "+383 44 123 456", "footer_text": "© 2025 RealEstate Kosovo. Të gjitha të drejtat e rezervuara.", "max_upload_size": 10, "currency": "EUR"}', 'Site settings'),
  ('properties', '{"require_approval": true, "max_images_per_property": 15, "allow_premium_features": true, "default_listing_duration": 30, "featured_properties_limit": 10, "free_user_image_limit": 3, "premium_user_image_limit": 15}', 'Property settings'),
  ('premium', '{"monthly_price": 9.99, "yearly_price": 99.99, "features": ["featured_listings", "unlimited_properties", "advanced_statistics", "priority_support", "more_images"]}', 'Premium subscription settings'),
  ('system', '{"maintenance_mode": false, "version": "1.0.0", "last_backup": null}', 'System settings');

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_timestamp
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_settings_timestamp();

-- Create a trigger to update the updated_at timestamp for notification preferences
CREATE TRIGGER update_notification_preferences_timestamp
BEFORE UPDATE ON user_notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_settings_timestamp();

-- Fix the admin privileges issues
-- Function to set a user as admin by UUID
CREATE OR REPLACE FUNCTION set_user_as_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Ensure the user exists and update them to be an admin
  UPDATE profiles SET is_admin = true
  WHERE id = user_id;
  
  -- Get the number of rows updated
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Return TRUE if a row was updated, FALSE otherwise
  RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set a user as admin by personal ID
CREATE OR REPLACE FUNCTION set_user_as_admin(user_personal_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Ensure the user exists and update them to be an admin
  UPDATE profiles SET is_admin = true
  WHERE personal_id = user_personal_id;
  
  -- Get the number of rows updated
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Return TRUE if a row was updated, FALSE otherwise
  RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set user as admin by email address
-- Explicitly typed as TEXT to avoid function overloading issues
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