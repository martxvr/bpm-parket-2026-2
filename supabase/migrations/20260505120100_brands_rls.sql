ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON brands
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated full brands" ON brands
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated full products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE brand_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brand_images" ON brand_images
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated full brand_images" ON brand_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
