-- ============================================================
-- Storage buckets and policies
-- ============================================================

-- Public media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for media bucket
CREATE POLICY "Public can read media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
