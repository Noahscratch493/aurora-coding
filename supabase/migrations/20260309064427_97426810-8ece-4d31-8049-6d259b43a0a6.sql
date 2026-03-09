
-- Tighten insert: require authenticated and set user_id
DROP POLICY IF EXISTS "Anyone can insert shared projects" ON public.shared_projects;

CREATE POLICY "Authenticated users can insert projects"
  ON public.shared_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tighten update: only authors
DROP POLICY IF EXISTS "Anyone can update shared projects" ON public.shared_projects;

CREATE POLICY "Authors can update own projects"
  ON public.shared_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
