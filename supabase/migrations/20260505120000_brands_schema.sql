CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  description text,
  internal_notes text,
  website_url text,
  hero_image text,
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  hero_image text,
  gallery_image_urls text[] DEFAULT '{}',
  specs jsonb DEFAULT '{}',
  decors jsonb DEFAULT '[]',
  spec_sheet_url text,
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (brand_id, slug)
);

CREATE TABLE brand_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads
  ADD COLUMN brand_id uuid REFERENCES brands(id),
  ADD COLUMN product_id uuid REFERENCES products(id);

CREATE INDEX idx_products_brand_service ON products(brand_id, service_id);
CREATE INDEX idx_products_service ON products(service_id, is_active);
CREATE INDEX idx_brand_images_brand ON brand_images(brand_id, sort_order);

CREATE TRIGGER set_updated_at_brands BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
