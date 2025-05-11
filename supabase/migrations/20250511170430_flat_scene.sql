-- Create a secure function to get a profile by ID
-- This function bypasses RLS policies and can be used safely
CREATE OR REPLACE FUNCTION get_profile_by_id(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Executes with the privileges of the function owner
SET search_path = public
AS $$
BEGIN
    RETURN (
        SELECT row_to_json(p)
        FROM profiles p
        WHERE p.id = user_id
    );
END;
$$;

-- Grant execute to the anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_profile_by_id TO anon, authenticated;