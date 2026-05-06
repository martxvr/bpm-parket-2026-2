-- Seed Sense PVC brand (Plan 5 Task 23)
WITH inserted_brand AS (
  INSERT INTO brands (slug, name, description, website_url, hero_image, logo_url, sort_order, is_active, internal_notes)
  VALUES (
    'sense',
    'Sense PVC',
    'Sense maakt PVC-vloeren bekend om hun natuurgetrouwe uitstraling, Nederlandse kwaliteit en zuivere samenstelling. Het assortiment omvat 52 dessins in plank-, XXL-plank-, visgraat- en tegelformaat (beton- en marmerlook). Met een extra slijtvaste PUR coating, R10 antislip en REACH-certificering biedt Sense tot 25 jaar woongarantie. Beschikbaar in dryback (verlijmd) of SPC click (drijvend).',
    'https://www.sensepvcvloeren.nl',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/08d7c79187b7dad6.webp',
    NULL,
    40,
    true,
    'Logo niet bij seed gevonden — handmatig toevoegen. Inkoopkanaal nog te bepalen (mogelijk Vloerenmarkt / De PVC Expert).'
  )
  RETURNING id
),
brand_imgs AS (
  INSERT INTO brand_images (brand_id, image_url, caption, sort_order)
  SELECT id, image_url, caption, sort_order FROM inserted_brand,
  (VALUES
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/08d7c79187b7dad6.webp', 'Sense PVC keuken sfeer', 1),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/a534111dccf0fd19.webp', 'Sense PVC kinderdagverblijf', 2),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/5729619831ac5b48.webp', 'Sense PVC kantoor beton-hout', 3)
  ) AS v(image_url, caption, sort_order)
  RETURNING brand_id
)
INSERT INTO products (brand_id, service_id, slug, name, description, hero_image, gallery_image_urls, specs, decors, sort_order, is_active)
SELECT id, 'f98375e1-8803-41ba-9e7e-b93700c035ee'::uuid, slug, name, description, hero_image, gallery, specs, decors, sort_order, true
FROM inserted_brand,
(VALUES
  (
    'pvc-collectie',
    'Sense PVC Collectie',
    'De Sense PVC-collectie biedt 52 dessins en 120 vloeropties in plank-, XXL-plank-, visgraat- en tegelformaat. Beschikbaar in dryback (verlijmd op egale ondergrond) en SPC click (drijvend, geïntegreerde ondervloer). Toplaag met PUR coating in 0,3 mm of 0,55 mm. Geluiddempend, watervast en geschikt voor vloerverwarming.',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/76cf67c159aab45a.webp',
    ARRAY[
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/c341a7a417a9aa93.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/46ea63a6f6346d3c.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/02041ba6d6e42d79.webp'
    ]::text[],
    '{"Dikte":"2–2,5 mm (dryback) / 5–6 mm (SPC click)","Toplaag":"0,3 mm of 0,55 mm PUR","Click of lijm":"Dryback (verlijmd) of SPC Click","Vloerverwarming":"Geschikt","Antislip":"R10","Garantie":"25 jaar (woon), 10 jaar (commercieel)","Certificering":"REACH"}'::jsonb,
    '[
      {"name":"G950 Click — Eikenlook","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/76cf67c159aab45a.webp"},
      {"name":"P170 Bleached Oak — Dryback","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/c341a7a417a9aa93.webp"},
      {"name":"P950 Black Oak — Dryback","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/b9da2d4b586c6a2e.webp"},
      {"name":"VE950 Visgraat — Dryback","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/46ea63a6f6346d3c.webp"},
      {"name":"W806 Sandstone Classico Tegel","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/b24888fe57901767.webp"},
      {"name":"W831 Tegel 45×90","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/sense/02041ba6d6e42d79.webp"}
    ]'::jsonb,
    1
  )
) AS p(slug, name, description, hero_image, gallery, specs, decors, sort_order);
