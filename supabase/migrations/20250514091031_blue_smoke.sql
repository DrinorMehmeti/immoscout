/*
  # Migrim për privilegjet administrative

  1. Grantime administrative bazuar në ID personale
    - Shton mundësinë për të caktuar një përdorues si administrator
    - Përditëson fushën `is_admin` në tabelën profiles

  2. Funksionaliteti
    - Funksion i ri set_user_as_admin që merr email-in ose ID personale
    - Mundëson administratorët ekzistues të emërojnë administratorë të rinj
    - Çdo përdorues me ID personale mund të bëhet administrator
*/

-- Funksion për të caktuar një përdorues si admin bazuar në ID personale
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_personal_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  UPDATE profiles
  SET is_admin = TRUE
  WHERE personal_id = user_personal_id;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funksion për të caktuar një përdorues si admin bazuar në email
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  success BOOLEAN;
BEGIN
  -- Gjej ID e përdoruesit nga email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Përditëso profilin për të caktuar admin = true
  UPDATE profiles
  SET is_admin = TRUE
  WHERE id = user_id;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;