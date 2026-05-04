-- ============================================================
-- Row Level Security policies
-- ============================================================

-- ----- Public-readable, admin-managed -----

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON gallery
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write gallery" ON gallery
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read knowledge" ON knowledge
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write knowledge" ON knowledge
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read policies" ON policies
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write policies" ON policies
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----- Public can submit, authenticated manages -----

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated read leads" ON leads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update leads" ON leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete leads" ON leads
  FOR DELETE TO authenticated USING (true);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit appointments" ON appointments
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated read appointments" ON appointments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update appointments" ON appointments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete appointments" ON appointments
  FOR DELETE TO authenticated USING (true);

-- ----- Admin only -----

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read admin_settings" ON admin_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update admin_settings" ON admin_settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
-- Public read for chatbot_enabled flag is handled via a server-side
-- function in Plan 2 that uses service role; the table itself remains
-- locked to authenticated.
