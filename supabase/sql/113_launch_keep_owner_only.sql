-- Launch cleanup: keep only the owner account tomas.marinho3@gmail.com.
-- Safe to re-run.

DO $$
DECLARE
  keeper uuid;
BEGIN
  SELECT id INTO keeper
  FROM auth.users
  WHERE email = 'tomas.marinho3@gmail.com';

  IF keeper IS NULL THEN
    RAISE EXCEPTION 'Keeper account tomas.marinho3@gmail.com not found';
  END IF;

  DELETE FROM auth.users
  WHERE id <> keeper;
END;
$$;

DELETE FROM public.private_leagues
WHERE lower(trim(name)) IN ('teste', 'test', 'qa league auto');
