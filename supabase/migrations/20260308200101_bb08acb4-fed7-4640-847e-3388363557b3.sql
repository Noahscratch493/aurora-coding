
CREATE TABLE public.shared_projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Untitled',
  author TEXT NOT NULL DEFAULT 'Anonymous',
  thumbnail TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  remix_of_id TEXT,
  remix_of_name TEXT
);

-- Allow anyone to read shared projects
ALTER TABLE public.shared_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shared projects"
  ON public.shared_projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert shared projects"
  ON public.shared_projects FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update shared projects"
  ON public.shared_projects FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete shared projects"
  ON public.shared_projects FOR DELETE
  TO anon, authenticated
  USING (true);
