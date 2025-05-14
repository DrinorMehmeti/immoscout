/*
  # Korrigjimi i statusit të administratorëve

  1. Vendos direkt vlerat e is_admin = TRUE për të gjithë përdoruesit me user_type 'seller' ose 'landlord'
  2. Krijon ose ripërcakton funksionet për të vendosur administratorët
  3. Sigurohet që ndryshimet të aplikohen pavarësisht RLS-së duke përdorur SECURITY DEFINER
*/

-- Përditëso direkt të gjithë përdoruesit ekzistues me user_type 'seller' ose 'landlord'
UPDATE public.profiles
SET is_admin = TRUE
WHERE user_type IN ('seller', 'landlord');

-- Krijoni funksionin për të vendosur is_admin bazuar në personal_id
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_personal_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Vendos flagun debug
  RAISE NOTICE 'Trying to set admin for user with personal_id: %', user_personal_id;

  -- Përditëson profilin
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE personal_id = user_personal_id;
  
  -- Merr rreshtat e ndikuar
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Regjistro rezultatin
  RAISE NOTICE 'Updated % rows for personal_id %', affected_rows, user_personal_id;
  
  -- Ktheje TRUE nëse të paktën një rresht është ndikuar
  RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Krijoni funksionin për të vendosur is_admin bazuar në email
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  affected_rows INTEGER;
BEGIN
  -- Vendos flagun debug
  RAISE NOTICE 'Trying to set admin for user with email: %', user_email;

  -- Gjej ID e përdoruesit nga email-i
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  -- Kthe false nëse përdoruesi nuk u gjet
  IF user_id IS NULL THEN
    RAISE NOTICE 'No user found with email %', user_email;
    RETURN FALSE;
  END IF;
  
  -- Përditëso profilin
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE id = user_id;
  
  -- Merr rreshtat e ndikuar
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Regjistro rezultatin
  RAISE NOTICE 'Updated % rows for user_id % with email %', affected_rows, user_id, user_email;
  
  -- Ktheje TRUE nëse të paktën një rresht është ndikuar
  RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Krijoni funksionin për të vendosur is_admin direkt me UUID
CREATE OR REPLACE FUNCTION public.set_admin_by_uuid(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Vendos flagun debug
  RAISE NOTICE 'Trying to set admin for user with UUID: %', user_id;

  -- Përditëso profilin
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE id = user_id;
  
  -- Merr rreshtat e ndikuar
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Regjistro rezultatin
  RAISE NOTICE 'Updated % rows for user_id %', affected_rows, user_id;
  
  -- Ktheje TRUE nëse të paktën një rresht është ndikuar
  RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funksion për të vendosur të gjithë përdoruesit në 'seller' dhe 'landlord' si administratorë
CREATE OR REPLACE FUNCTION public.update_all_seller_landlord_to_admin()
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Përditëso profilin
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE user_type IN ('seller', 'landlord');
  
  -- Merr rreshtat e ndikuar
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Regjistro rezultatin
  RAISE NOTICE 'Updated % users to admin status', affected_rows;
  
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ekzekuto funksionin menjëherë për të siguruar që të gjithë shitësit dhe qiradhënësit të jenë admin
SELECT public.update_all_seller_landlord_to_admin();

-- Shto një check constraint për të siguruar që vlera e is_admin është e vlefshme
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS valid_admin_status;

ALTER TABLE public.profiles
ADD CONSTRAINT valid_admin_status CHECK (is_admin IN (TRUE, FALSE));