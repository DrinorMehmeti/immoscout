/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, non-nullable)
      - `title` (text, non-nullable)
      - `message` (text, non-nullable)
      - `type` (text, non-nullable)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `property_id` (uuid, nullable, references properties)

  2. Security
    - Enable RLS on `notifications` table
    - Add policy for users to view their own notifications
    - Add policy for users to update their own notifications
    - Add policy for admins to create notifications for any user
*/

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications USING btree (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_property_id ON public.notifications USING btree (property_id);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications for any user"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    ))
    OR 
    (auth.uid() = user_id)
  );

-- Add comment for documentation
COMMENT ON TABLE public.notifications IS 'Stores user notifications for various events like property approvals, rejections, etc.';