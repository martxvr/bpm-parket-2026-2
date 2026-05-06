-- Seed Otium brand (Plan 5 Task 23)
WITH inserted_brand AS (
  INSERT INTO brands (slug, name, description, website_url, hero_image, logo_url, sort_order, is_active, internal_notes)
  VALUES (
    'otium',
    'Otium at Home',
    'Otium at Home staat voor toegankelijke kwaliteitsvloeren — laminaat, PVC en hout — met een tijdloze, natuurgetrouwe uitstraling. De PVC-collectie (NXT en Original) en laminaat-collecties (Amber, Spice, Emerald, Ritual, Everest, Dahlia, Silk, Calyx) bieden een breed dessinpalet met ultra matte afwerking, embossed-in-register textuur en compatibiliteit met vloerverwarming.',
    'https://www.otiumathome.com',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/5921a64b25144ba8.webp',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/6b96e08b76e33ce0.webp',
    30,
    true,
    'Inkoop via Plinten en Profielen Centrale (PPC). Garantie tot 25 jaar (woon).'
  )
  RETURNING id
),
brand_imgs AS (
  INSERT INTO brand_images (brand_id, image_url, caption, sort_order)
  SELECT id, image_url, caption, sort_order FROM inserted_brand,
  (VALUES
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/5921a64b25144ba8.webp', 'Otium PVC categorie', 1),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/494b4db97fa3374c.webp', 'Otium matten sfeer', 2),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/f498e0708ea917f6.webp', 'Otium roomdesigner', 3),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/e787c8e4e3224999.webp', 'PVC plank collectie', 4),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/81afa27abd21136c.webp', 'Laminaat Amber', 5)
  ) AS v(image_url, caption, sort_order)
  RETURNING brand_id
)
INSERT INTO products (brand_id, service_id, slug, name, description, hero_image, gallery_image_urls, specs, decors, sort_order, is_active)
SELECT id, service_id::uuid, slug, name, description, hero_image, gallery, specs, decors, sort_order, true
FROM inserted_brand,
(VALUES
  (
    'f98375e1-8803-41ba-9e7e-b93700c035ee',
    'pvc-plank',
    'PVC Plank (NXT & Original)',
    'De Otium PVC plank-collectie bestaat uit de series NXT en Original, met 0,55 mm slijtlaag in plank- en visgraat-formaat. Beschikbaar als click (PVC-klik / Rigid SPC) of dryback (verlijmd). De ultra matte afwerking met embossed-in-register textuur geeft een natuurgetrouwe houtuitstraling. Geschikt voor vloerverwarming en -koeling.',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/e787c8e4e3224999.webp',
    ARRAY[
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/c6696830c8468ba0.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/744ce42499762090.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/1dd5ca38e86a44ec.webp'
    ]::text[],
    '{"Dikte":"2,5 / 5,2 / 6 mm","Click of lijm":"Click (PVC-klik) of dryback","Vloerverwarming":"Geschikt (ook koeling)","Slijtklasse":"33","Afmeting":"121,9–151,8 cm × 22,6–24,1 cm","Oppervlak":"Ultra mat, embossed-in-register","Garantie":"25 jaar (woon)"}'::jsonb,
    '[
      {"name":"Calm","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/c6696830c8468ba0.webp"},
      {"name":"Hammam","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/744ce42499762090.webp"},
      {"name":"Crystal","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/1dd5ca38e86a44ec.webp"},
      {"name":"Lagune","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/441564738e96632d.webp"}
    ]'::jsonb,
    1
  ),
  (
    '5569d32b-70c8-467f-8568-987341f05025',
    'laminaat-spice',
    'Laminaat Spice',
    'De Otium Spice laminaat-collectie brengt warme natuurtinten in huis met een slim click-locksysteem voor eenvoudige installatie. Vier dessins variërend van zacht beige-grijs tot dieper warm bruin. Geschikt voor vloerverwarming.',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/041f0ffaa3838741.webp',
    ARRAY[
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/69f310b365167c97.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/362b96f4728662d3.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/1fb76b74d9ea856a.webp'
    ]::text[],
    '{"Dikte":"7 mm","Click of lijm":"Click","Vloerverwarming":"Geschikt (ook koeling)","Slijtklasse":"32","Oppervlak":"Embossed met natuurlijke groef","Garantie":"15+ jaar (woon)"}'::jsonb,
    '[
      {"name":"Spice Beige Grey","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/69f310b365167c97.webp"},
      {"name":"Spice Grey Oil","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/362b96f4728662d3.webp"},
      {"name":"Spice Natural Oil","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/1fb76b74d9ea856a.webp"},
      {"name":"Spice Warm","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/otium/11a3bdc7d6cf559d.webp"}
    ]'::jsonb,
    2
  )
) AS p(service_id, slug, name, description, hero_image, gallery, specs, decors, sort_order);
