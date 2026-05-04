-- Remove a legacy permissive INSERT policy that re-enabled the impersonation
-- vector by allowing anyone to insert (WITH CHECK true). PG ORs permissive
-- policies, so the new restricted policy is bypassed while this one exists.
DROP POLICY IF EXISTS "Allow insert for everyone" ON public.predictions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.predictions;
