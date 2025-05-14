/*
  # Korrigjimi i funksioneve të administratorit

  1. Ndryshime
    - Korrigjon funksionin `set_admin_by_email` duke ndryshuar tipin e variablës `success` nga BOOLEAN në INTEGER
    - Korrigjon funksionin `set_user_as_admin` me të njëjtën mënyrë
    - Siguron që të dy funksionet të kthejnë vlerë booleane bazuar në numrin e rreshtave të përditësuar
*/

-- Funksion i korrigjuar për të caktuar një përdorues si admin bazuar në ID personale
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_personal_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  success INTEGER;  -- Ndryshuar nga BOOLEAN në INTEGER për të ruajtur numrin e rreshtave
BEGIN
  UPDATE profiles
  SET is_admin = TRUE
  WHERE personal_id = user_personal_id;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;  -- Kthen TRUE nëse të paktën një rresht u përditësua
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funksion i korrigjuar për të caktuar një përdorues si admin bazuar në email
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  success INTEGER;  -- Ndryshuar nga BOOLEAN në INTEGER për të ruajtur numrin e rreshtave
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
  RETURN success > 0;  -- Kthen TRUE nëse të paktën një rresht u përditësua
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;