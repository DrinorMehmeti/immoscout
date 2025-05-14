/*
  # Create unified admin function for UUID or email

  1. New Function
    - `set_admin_by_uuid_or_email` - Handles both UUID and email inputs with a flag
      - Resolves ambiguity issues with the previous separate email functions
      - Accepts a identifier (UUID or email) and a boolean flag indicating if it's an email
  
  2. Security
    - Function can only be executed by authenticated users
*/

CREATE OR REPLACE FUNCTION public.set_admin_by_uuid_or_email(
  identifier TEXT,
  is_email BOOLEAN
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- If is_email is true, find user by email, otherwise assume it's a UUID
  IF is_email THEN
    -- Get the user ID from the email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = identifier;
  ELSE
    -- Assume the identifier is already a UUID
    BEGIN
      target_user_id := identifier::UUID;
    EXCEPTION WHEN OTHERS THEN
      RETURN FALSE;
    END;
  END IF;

  -- If user not found, return false
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Update the profile to set is_admin to true
  UPDATE profiles
  SET is_admin = TRUE
  WHERE id = target_user_id;

  RETURN FOUND;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.set_admin_by_uuid_or_email(TEXT, BOOLEAN) TO authenticated;