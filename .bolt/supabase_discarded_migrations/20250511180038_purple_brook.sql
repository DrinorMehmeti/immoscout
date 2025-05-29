/*
  # Property status notification system

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `property_id` (uuid, references properties.id)
      - `title` (text)
      - `message` (text)
      - `type` (text - 'approval', 'rejection', 'view', etc.)
      - `is_read` (boolean)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `notifications` table
    - Add policies for users to read their own notifications
    - Add policies for admins to create notifications
  
  3. Trigger Functions
    - Create trigger to automatically generate notifications when property status changes
*/

-- Create notifications table for user alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Create index on is_read for filtering
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable row level security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to mark their own notifications as read
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to create notifications for any user
CREATE POLICY "Admins can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to create notifications when property status changes
CREATE OR REPLACE FUNCTION public.notify_property_status_change()
RETURNS TRIGGER AS $$
DECLARE
  title_text TEXT;
  message_text TEXT;
  notification_type TEXT;
BEGIN
  -- Only create notification when status changes
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Set notification type based on the new status
    IF NEW.status = 'active' THEN
      notification_type := 'approval';
      title_text := 'Prona juaj u aprovua';
      message_text := 'Prona juaj "' || substring(NEW.title from 1 for 30) || '..." tani është aktive dhe e dukshme për të gjithë përdoruesit.';
    ELSIF NEW.status = 'rejected' THEN
      notification_type := 'rejection';
      title_text := 'Prona juaj u refuzua';
      message_text := 'Prona juaj "' || substring(NEW.title from 1 for 30) || '..." u refuzua. Ju lutemi kontaktoni administratorin për më shumë informacione.';
    ELSE
      -- For other status changes
      notification_type := 'status_change';
      title_text := 'Statusi i pronës u ndryshua';
      message_text := 'Statusi i pronës suaj "' || substring(NEW.title from 1 for 30) || '..." u ndryshua në "' || NEW.status || '".';
    END IF;

    -- Insert notification for the property owner
    INSERT INTO public.notifications (
      user_id,
      property_id,
      title,
      message,
      type
    ) VALUES (
      NEW.owner_id,
      NEW.id,
      title_text,
      message_text,
      notification_type
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for property status changes
DROP TRIGGER IF EXISTS property_status_change_notification ON public.properties;
CREATE TRIGGER property_status_change_notification
  AFTER UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_property_status_change();

COMMENT ON TABLE public.notifications IS 'User notifications for property status changes and other events';
COMMENT ON FUNCTION public.notify_property_status_change() IS 'Trigger function to create notifications when property status changes';