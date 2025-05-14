/*
  # Korrigjimi i funksioneve të administratorit dhe RLS

  1. Ndryshimet
     - Korrigjimi i funksioneve për caktimin e përdoruesve si administratorë
     - Sigurimi që këto funksione kanë të drejta të mjaftueshme (SECURITY DEFINER)
     - Shtimi i përditësimeve direkte SQL për administratorë
     
  2. Siguria
     - Funksionet kanë SECURITY DEFINER për të siguruar që ato të ekzekutohen me privilegje të plota
*/

-- Korrigjo funksionin për të caktuar një përdorues si admin bazuar në ID personale
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_personal_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  success INTEGER;  -- INTEGER për të ruajtur numrin e rreshtave të përditësuar
BEGIN
  -- Kryej përditësimin
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE personal_id = user_personal_id;
  
  -- Merr numrin e rreshtave të përditësuar
  GET DIAGNOSTICS success = ROW_COUNT;
  
  -- Log rezultatin për debugging
  RAISE NOTICE 'Updated % rows for personal_id %', success, user_personal_id;
  
  -- Kthen TRUE nëse të paktën një rresht u përditësua
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Korrigjo funksionin për të caktuar një përdorues si admin bazuar në email
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  success INTEGER;  -- INTEGER për të ruajtur numrin e rreshtave të përditësuar
BEGIN
  -- Gjej ID e përdoruesit nga email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  -- Kthehu FALSE nëse nuk u gjet përdoruesi
  IF user_id IS NULL THEN
    RAISE NOTICE 'No user found with email %', user_email;
    RETURN FALSE;
  END IF;
  
  -- Përditëso profilin për të caktuar admin = true
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE id = user_id;
  
  -- Merr numrin e rreshtave të përditësuar
  GET DIAGNOSTICS success = ROW_COUNT;
  
  -- Log rezultatin për debugging
  RAISE NOTICE 'Updated % rows for user_id % with email %', success, user_id, user_email;
  
  -- Kthen TRUE nëse të paktën një rresht u përditësua
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funksion për të caktuar një përdorues si admin bazuar në ID UUID
CREATE OR REPLACE FUNCTION public.set_admin_by_uuid(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success INTEGER;  -- INTEGER për të ruajtur numrin e rreshtave të përditësuar
BEGIN
  -- Përditëso profilin për të caktuar admin = true
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE id = user_id;
  
  -- Merr numrin e rreshtave të përditësuar
  GET DIAGNOSTICS success = ROW_COUNT;
  
  -- Log rezultatin për debugging
  RAISE NOTICE 'Updated % rows for user_id %', success, user_id;
  
  -- Kthen TRUE nëse të paktën një rresht u përditësua
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Krijoni një funksion për të përditësuar statusin is_admin për të gjithë përdoruesit aktualë
CREATE OR REPLACE FUNCTION public.update_admin_status_for_all_users()
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE user_type IN ('seller', 'landlord');
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RAISE NOTICE 'Updated % rows with is_admin = TRUE', affected_rows;
  
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ekzekutimi direkt i funksionit për të përditësuar administratorët bazuar në user_type
-- Kjo do të caktojë të gjithë shitësit dhe qiradhënësit si administratorë
SELECT update_admin_status_for_all_users();