-- Seed JOKA brand (Plan 5 Task 23)
WITH inserted_brand AS (
  INSERT INTO brands (slug, name, description, website_url, hero_image, logo_url, sort_order, is_active, internal_notes)
  VALUES (
    'joka',
    'JOKA',
    'JOKA is een Duits familiebedrijf (W.L. Jordan) dat al meer dan 100 jaar hoogwaardige vloeren, deuren en woontextiel produceert. De LVT-collectie staat bekend om duurzame elegantie, comfort en betrouwbare techniek — met natuurgetrouwe hout- en steendecors, voelbare structuren en een rustig loopgevoel. Geschikt voor zowel woningen als commerciële ruimtes.',
    'https://www.joka.de/nl_nl/b2c/',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/0894a614b2c1eb48.webp',
    NULL,
    10,
    true,
    'Inkoop via Jordan Nederland (jordanshop.nl). Logo niet bij seed gevonden — handmatig toe te voegen.'
  )
  RETURNING id
),
brand_imgs AS (
  INSERT INTO brand_images (brand_id, image_url, caption, sort_order)
  SELECT id, image_url, caption, sort_order FROM inserted_brand,
  (VALUES
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/0894a614b2c1eb48.webp', 'JOKA woonsfeer inspiratie', 1),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/9b733502c2c7c02f.webp', 'Hygge stijl slaapkamer', 2),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/8cced1b26304276b.webp', 'JOKA showroom Kassel', 3),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/71e56b81cf630bae.webp', 'Vakman aan het werk', 4)
  ) AS v(image_url, caption, sort_order)
  RETURNING brand_id
)
INSERT INTO products (brand_id, service_id, slug, name, description, hero_image, gallery_image_urls, specs, decors, sort_order, is_active)
SELECT id, 'f98375e1-8803-41ba-9e7e-b93700c035ee'::uuid, slug, name, description, hero_image, gallery, specs, decors, sort_order, true
FROM inserted_brand,
(VALUES
  (
    'lvt-555-rigid-click',
    'LVT 555 Rigid Click',
    'De JOKA LVT 555 Rigid Click is de premium PVC-clickvloer uit het 555-segment, met een 0,55 mm slijtlaag en een 6 mm rigid kern voor extra stabiliteit. Door het clicksysteem ligt de vloer drijvend en is hij snel te leggen, ook over bestaande ondergronden. EIR-structuur (Embossed in Register) zorgt voor een voelbaar houtdessin dat exact in lijn ligt met de print.',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/8f17413b1a37cd92.webp',
    ARRAY[
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/5fd3112395abd8c0.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/a4a396383fc76b78.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/ccc0f414d7499318.webp'
    ]::text[],
    '{"Dikte":"6 mm (incl. 1 mm IXPE)","Slijtlaag":"0,55 mm","Click of lijm":"Rigid Click","Vloerverwarming":"Geschikt","Slijtklasse":"33","Afmeting plank":"1212 × 178 mm","Afmeting tegel":"914 × 457 mm","Oppervlak":"EIR — embossed in register"}'::jsonb,
    '[
      {"name":"Incredible Light Oak","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/8f17413b1a37cd92.webp"},
      {"name":"Incredible Classic Oak","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/5fd3112395abd8c0.webp"},
      {"name":"Incredible Dark Oak","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/a4a396383fc76b78.webp"},
      {"name":"Perfect Grey Oak","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/05702e3cf2a6c0fd.webp"},
      {"name":"Perfect Beige Oak","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/4a1821b77eba48e9.webp"},
      {"name":"Dark Concrete","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/ab195bf370cd91c9.webp"}
    ]'::jsonb,
    1
  ),
  (
    'lvt-340-rigid-click',
    'LVT 340 Rigid Click',
    'De JOKA LVT 340 Rigid Click is een toegankelijke PVC-clickvloer uit het 340-segment, met een 0,4 mm slijtlaag en 5 mm rigid kern. Het clicksysteem maakt drijvende installatie eenvoudig, ook op bestaande tegelvloeren. Beschikbaar in plank- en tegelformaat met natuurlijke hout- en betondessins.',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/38bfddf3b3858d05.webp',
    ARRAY[
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/3fb7a3dafab65720.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/65720fae9b3d2a97.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/63832d21738024cc.webp'
    ]::text[],
    '{"Dikte":"5 mm","Slijtlaag":"0,4 mm","Click of lijm":"Rigid Click","Vloerverwarming":"Geschikt","Slijtklasse":"32","Afmeting plank":"1244,6 × 178,1 mm","Afmeting tegel":"607,2 × 303,1 mm","Oppervlak":"PU-beschermlaag, geborsteld matlak"}'::jsonb,
    '[
      {"name":"812 Pure Oak","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/38bfddf3b3858d05.webp"},
      {"name":"823 Vanilla Oak","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/3fb7a3dafab65720.webp"},
      {"name":"870 Chalet Oak Black","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/65720fae9b3d2a97.webp"},
      {"name":"845 Dark Concrete","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/63832d21738024cc.webp"},
      {"name":"884 Mountain Slate","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/114f44273bb8ecfe.webp"},
      {"name":"885 Classic Concrete","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/joka/66d9d83448bee3d8.webp"}
    ]'::jsonb,
    2
  )
) AS p(slug, name, description, hero_image, gallery, specs, decors, sort_order);
