-- Seed Douwes Dekker brand (Plan 5 Task 23)
WITH inserted_brand AS (
  INSERT INTO brands (slug, name, description, website_url, hero_image, logo_url, sort_order, is_active, internal_notes)
  VALUES (
    'douwes-dekker',
    'Douwes Dekker',
    'Douwes Dekker biedt karakteristieke laminaat- en PVC-vloeren met een knipoog naar smaakvolle ingrediënten — denk aan dessins als Olijf, Truffel en Aardbei. De collecties combineren natuurgetrouwe houtuitstraling met praktische voordelen zoals slijtvastheid, vloerverwarmingsgeschiktheid en eenvoudige installatie via clicksysteem (laminaat) of dryback/click (PVC).',
    'https://www.douwesdekker.nl',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/01df9f9335ef3726.webp',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/f08306fcd0d38ef4.webp',
    20,
    true,
    'Inkoop via Plinten en Profielen Centrale (PPC). Hero: PVC homepage shot.'
  )
  RETURNING id
),
brand_imgs AS (
  INSERT INTO brand_images (brand_id, image_url, caption, sort_order)
  SELECT id, image_url, caption, sort_order FROM inserted_brand,
  (VALUES
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/01df9f9335ef3726.webp', 'PVC vloer sfeer', 1),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/7b0edbc494d60085.webp', 'Laminaat sfeer', 2),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/b67f3b2062b3a9dd.webp', 'Traprenovatie', 3),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/4ec8384e3f01b7c5.webp', 'PVC plank collectie', 4),
    ('https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/3a0c0e26fc5ac3c3.webp', 'Laminaat plank collectie', 5)
  ) AS v(image_url, caption, sort_order)
  RETURNING brand_id
)
INSERT INTO products (brand_id, service_id, slug, name, description, hero_image, gallery_image_urls, specs, decors, sort_order, is_active)
SELECT id, service_id::uuid, slug, name, description, hero_image, gallery, specs, decors, sort_order, true
FROM inserted_brand,
(VALUES
  (
    'f98375e1-8803-41ba-9e7e-b93700c035ee',
    'pvc-rechte-plank',
    'PVC Rechte Plank',
    'De Douwes Dekker PVC rechte plank-collectie omvat de series Ambitieus en Nieuwe Oogst, met dessins gebaseerd op smaakvolle ingrediënten. Beschikbaar in zwevende click- of verlijmde dryback-uitvoering, met een ultra matte ''embossed in register''-toplaag voor een zeer natuurlijke houtuitstraling. Geschikt voor zwaar huishoudelijk en commercieel gebruik in combinatie met vloerverwarming en -koeling.',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/4ec8384e3f01b7c5.webp',
    ARRAY[
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/c6696830c8468ba0.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/d2a907a106413c15.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/4411016b109411c4.webp'
    ]::text[],
    '{"Dikte":"2,5 / 6 / 6,5 / 7,5 mm","Click of lijm":"Click (zwevend) of dryback (verlijmd)","Vloerverwarming":"Geschikt (ook koeling)","Slijtklasse":"23 (woon) / 33 (commercieel)","Afmeting":"151–152,4 cm × 22–24,13 cm","Oppervlak":"Ultra mat, embossed in register"}'::jsonb,
    '[
      {"name":"Plank Aardbei","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/c6696830c8468ba0.webp"},
      {"name":"Plank Cranberry","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/4411016b109411c4.webp"},
      {"name":"Plank Druif","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/d2a907a106413c15.webp"},
      {"name":"Plank Framboos","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/d1be2356fdfaca8b.webp"},
      {"name":"Plank Kiwi","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/7f048a7dc7713fe3.webp"},
      {"name":"Plank Mandarijn","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/fd97c10e8574ae89.webp"}
    ]'::jsonb,
    1
  ),
  (
    '5569d32b-70c8-467f-8568-987341f05025',
    'laminaat-rechte-plank',
    'Laminaat Rechte Plank',
    'De Douwes Dekker laminaat rechte plank-collectie omvat de series Sympathiek, Spontaan, Krachtig, Trots en Puur, met dessins die warmte en karakter aan elke ruimte toevoegen. Het clicksysteem zorgt voor eenvoudige installatie zonder lijm. Embossed (in register) oppervlak geeft de planken een voelbare houtnerf-structuur.',
    'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/3a0c0e26fc5ac3c3.webp',
    ARRAY[
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/c664358a4c2d1205.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/f1ef3ea959dd0028.webp',
      'https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/9612721f9087e586.webp'
    ]::text[],
    '{"Dikte":"7 / 8 mm","Click of lijm":"Click","Vloerverwarming":"Geschikt","Slijtklasse":"23 (woon) / 32 (commercieel)","Afmeting":"126,1–220 cm × 19,2–24,4 cm","Oppervlak":"Embossed of embossed-in-register"}'::jsonb,
    '[
      {"name":"Brede plank Balsamico","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/c664358a4c2d1205.webp"},
      {"name":"Brede plank Olijf","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/f1ef3ea959dd0028.webp"},
      {"name":"Extra lange plank Truffel","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/9612721f9087e586.webp"},
      {"name":"Brede plank Koriander","image_url":"https://pkgcvvpqflnyzjbowuej.supabase.co/storage/v1/object/public/media/site/douwes-dekker/3839cf35afc3ef9e.webp"}
    ]'::jsonb,
    2
  )
) AS p(service_id, slug, name, description, hero_image, gallery, specs, decors, sort_order);
