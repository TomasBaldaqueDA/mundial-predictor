-- Allow users to create their own profile row if the signup trigger did not run.
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Multiple empty display names blocked everyone after the first signup; only enforce uniqueness for real names.
DROP INDEX IF EXISTS public.profiles_display_name_unique;
CREATE UNIQUE INDEX profiles_display_name_unique
  ON public.profiles (lower(display_name))
  WHERE char_length(trim(display_name)) > 0;
