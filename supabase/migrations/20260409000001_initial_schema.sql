-- =============================================================
-- PVC Vloeren Achterhoek — Initial Schema
-- =============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- TABLES
-- =============================================================

CREATE TABLE IF NOT EXISTS projects (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         text NOT NULL,
  description   text,
  long_description text,
  image_url     text,
  category      text,
  location      text,
  area_size     integer,
  date          timestamptz,
  techniques    text[],
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  location   text,
  text       text NOT NULL,
  stars      integer CHECK (stars BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         text NOT NULL,
  email        text,
  phone        text,
  address      text,
  city         text,
  zip          text,
  company_name text,
  notes        text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  date        timestamptz NOT NULL,
  service     text CHECK (service IN ('pvc-vloeren','traprenovatie','vloerbedekking','raamdecoratie','gordijnen','anders')),
  status      text DEFAULT 'nieuw' CHECK (status IN ('nieuw','bevestigd','afgerond','geannuleerd')),
  notes       text,
  source      text DEFAULT 'handmatig' CHECK (source IN ('chatbot','handmatig')),
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offertes (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name text NOT NULL,
  email         text,
  phone         text,
  service       text CHECK (service IN ('pvc-vloeren','traprenovatie','vloerbedekking','raamdecoratie','gordijnen','andere')),
  message       text,
  status        text DEFAULT 'nieuw' CHECK (status IN ('nieuw','behandeling','verzonden','gesloten')),
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_kennisbank (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      text NOT NULL,
  category   text,
  content    text NOT NULL,
  icon       text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename   text NOT NULL,
  url        text NOT NULL,
  mime_type  text,
  size       integer,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        text UNIQUE NOT NULL,
  value      jsonb,
  updated_at timestamptz DEFAULT now()
);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE offertes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_kennisbank ENABLE ROW LEVEL SECURITY;
ALTER TABLE media        ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;

-- Public read (website)
CREATE POLICY public_read_projects      ON projects      FOR SELECT USING (true);
CREATE POLICY public_read_testimonials  ON testimonials  FOR SELECT USING (true);
CREATE POLICY public_read_ai_kennisbank ON ai_kennisbank FOR SELECT USING (true);
CREATE POLICY public_read_settings      ON settings      FOR SELECT USING (true);
CREATE POLICY public_read_media         ON media         FOR SELECT USING (true);

-- Public insert (offerte form, chatbot bookings)
CREATE POLICY public_insert_offertes     ON offertes     FOR INSERT WITH CHECK (true);
CREATE POLICY public_insert_appointments ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY public_insert_customers    ON customers    FOR INSERT WITH CHECK (true);

-- Public update customers (chatbot can upsert existing customer)
CREATE POLICY public_update_customers ON customers FOR UPDATE USING (true) WITH CHECK (true);

-- Authenticated full access (admin panel)
CREATE POLICY auth_all_projects      ON projects      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY auth_all_testimonials  ON testimonials  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY auth_all_customers     ON customers     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY auth_all_appointments  ON appointments  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY auth_all_offertes      ON offertes      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY auth_all_ai_kennisbank ON ai_kennisbank FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY auth_all_media         ON media         FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY auth_all_settings      ON settings      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =============================================================
-- RPC: first-admin check (used in login/actions.ts)
-- =============================================================

CREATE OR REPLACE FUNCTION has_no_users()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM auth.users LIMIT 1);
END;
$$;

-- =============================================================
-- STORAGE BUCKET
-- =============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "storage_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "storage_auth_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "storage_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
