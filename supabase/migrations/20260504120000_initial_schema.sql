-- ============================================================
-- Initial schema for BPM Parket
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----- services -----
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  hero_image text,
  body_md text,
  meta_title text,
  meta_description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ----- projects -----
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  long_description text,
  image_url text,
  gallery_image_urls text[] DEFAULT '{}',
  area_size int,
  location text,
  completed_date date,
  techniques text[] DEFAULT '{}',
  floor_type text,
  is_featured bool DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ----- gallery -----
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ----- knowledge -----
CREATE TABLE knowledge (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ----- policies (privacy/cookies/terms content) -----
CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content_md text NOT NULL,
  last_updated timestamptz DEFAULT now()
);

-- ----- leads -----
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  floor_type text,
  area_size int,
  message text,
  source text,
  status text DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'completed')),
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz DEFAULT now()
);

-- ----- appointments -----
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  date timestamptz NOT NULL,
  notes text,
  source text
    CHECK (source IN ('chatbot', 'website', 'manual')),
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

-- ----- admin_settings (single-row) -----
CREATE TABLE admin_settings (
  id int PRIMARY KEY DEFAULT 1,
  chatbot_enabled bool DEFAULT true,
  system_prompt_extra text,
  phone text,
  whatsapp text,
  CHECK (id = 1)
);

INSERT INTO admin_settings (id) VALUES (1);

-- ----- updated_at trigger helper -----
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_services BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_knowledge BEFORE UPDATE ON knowledge
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----- indexes -----
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(is_featured, sort_order);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_leads_status ON leads(status, created_at DESC);
CREATE INDEX idx_appointments_date ON appointments(date);
