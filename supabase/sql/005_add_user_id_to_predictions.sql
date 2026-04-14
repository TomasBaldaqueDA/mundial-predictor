-- Link predictions to auth user so we can show current profile display_name
ALTER TABLE public.predictions
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Allow authenticated users to read all profiles (for ranking and match prediction lists)
CREATE POLICY "Authenticated can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
