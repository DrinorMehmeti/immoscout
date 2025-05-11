/*
  # Property status notification trigger

  1. Changes
     - Creates a database trigger to automatically generate notifications when property status changes
     - Notifies property owners about approval, rejection, or other status changes
  
  2. Notification Types
     - 'approval': When a property is changed from 'pending' to 'active'
     - 'rejection': When a property is changed from 'pending' to 'rejected'
     - 'status_change': For all other status changes
*/

-- Create function to handle property status changes
CREATE OR REPLACE FUNCTION notify_property_status_change()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Only execute if the status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Set notification type and message based on status change
  IF OLD.status = 'pending' AND NEW.status = 'active' THEN
    notification_type := 'approval';
    notification_title := 'Prona juaj u aprovua';
    notification_message := 'Prona juaj "' || NEW.title || '" u aprovua dhe tani është e dukshme për të gjithë përdoruesit.';
  ELSIF OLD.status = 'pending' AND NEW.status = 'rejected' THEN
    notification_type := 'rejection';
    notification_title := 'Prona juaj u refuzua';
    notification_message := 'Prona juaj "' || NEW.title || '" u refuzua. Ju lutemi kontaktoni administratorin për më shumë informacion.';
  ELSIF NEW.status = 'sold' THEN
    notification_type := 'status_change';
    notification_title := 'Prona juaj u shënua si e shitur';
    notification_message := 'Prona juaj "' || NEW.title || '" u shënua si e shitur. Urime!';
  ELSIF NEW.status = 'rented' THEN
    notification_type := 'status_change';
    notification_title := 'Prona juaj u shënua si e dhënë me qira';
    notification_message := 'Prona juaj "' || NEW.title || '" u shënua si e dhënë me qira. Urime!';
  ELSIF NEW.status = 'inactive' THEN
    notification_type := 'status_change';
    notification_title := 'Prona juaj u çaktivizua';
    notification_message := 'Prona juaj "' || NEW.title || '" u çaktivizua dhe nuk është më e dukshme për përdoruesit.';
  ELSE
    notification_type := 'status_change';
    notification_title := 'Statusi i pronës suaj u ndryshua';
    notification_message := 'Statusi i pronës suaj "' || NEW.title || '" u ndryshua në "' || NEW.status || '".';
  END IF;
  
  -- Insert notification for property owner
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    property_id
  ) VALUES (
    NEW.owner_id,
    notification_title,
    notification_message,
    notification_type,
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS property_status_change ON properties;

-- Create the trigger
CREATE TRIGGER property_status_change
AFTER UPDATE OF status ON properties
FOR EACH ROW
EXECUTE FUNCTION notify_property_status_change();

-- Create trigger function to update properties.updated_at on any change
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updating the updated_at timestamp
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_properties_updated_at();

-- Create function to prevent duplicate views within a short time period
CREATE OR REPLACE FUNCTION check_recent_view()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this user/IP has already viewed this property in the last hour
  IF EXISTS (
    SELECT 1 
    FROM property_views
    WHERE 
      property_id = NEW.property_id AND
      (
        (NEW.viewer_id IS NOT NULL AND viewer_id = NEW.viewer_id) OR
        (NEW.ip_address IS NOT NULL AND ip_address = NEW.ip_address)
      ) AND
      viewed_at > NOW() - INTERVAL '1 hour'
  ) THEN
    -- Do not insert duplicate view
    RETURN NULL;
  END IF;
  
  -- Allow the view to be inserted
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update profiles updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updating the updated_at timestamp on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();