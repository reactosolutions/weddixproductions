-- ============================================================
--  Weddiex — Supabase schema
--  Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Storage ───────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public read gallery storage"  ON storage.objects;
DROP POLICY IF EXISTS "auth upload gallery storage"  ON storage.objects;
DROP POLICY IF EXISTS "auth update gallery storage"  ON storage.objects;
DROP POLICY IF EXISTS "auth delete gallery storage"  ON storage.objects;

CREATE POLICY "public read gallery storage"
  ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "auth upload gallery storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "auth update gallery storage"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "auth delete gallery storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- ── Tables ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery_items (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  category      text        NOT NULL,
  label         text        NOT NULL,
  image_url     text,
  aspect        text        NOT NULL DEFAULT 'aspect-[3/4]',
  featured      boolean     NOT NULL DEFAULT false,
  display_order int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  quote         text        NOT NULL,
  client_name   text        NOT NULL,
  initials      text        NOT NULL,
  detail        text        NOT NULL,
  display_order int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key   text PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE gallery_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read gallery_items"  ON gallery_items;
DROP POLICY IF EXISTS "public read testimonials"   ON testimonials;
DROP POLICY IF EXISTS "public read site_settings"  ON site_settings;
DROP POLICY IF EXISTS "admin write gallery_items"  ON gallery_items;
DROP POLICY IF EXISTS "admin write testimonials"   ON testimonials;
DROP POLICY IF EXISTS "admin write site_settings"  ON site_settings;

-- Public read
CREATE POLICY "public read gallery_items"
  ON gallery_items FOR SELECT USING (true);
  
CREATE POLICY "public read testimonials"
  ON testimonials FOR SELECT USING (true);

CREATE POLICY "public read site_settings"
  ON site_settings FOR SELECT USING (true);

-- Authenticated write
CREATE POLICY "admin write gallery_items"
  ON gallery_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin write testimonials"
  ON testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin write site_settings"
  ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ── Seed — Gallery Items ──────────────────────────────────────

TRUNCATE gallery_items RESTART IDENTITY CASCADE;
INSERT INTO gallery_items (category, label, aspect, featured, display_order) VALUES
  ('Weddings',     'Wedding couple portrait',      'aspect-[3/4]',   true,  1),
  ('Graduations',  'Graduate portrait',            'aspect-[2/3]',   true,  2),
  ('Portraits',    'Woman in elegant dress',       'aspect-[2/3]',   true,  3),
  ('Events',       'Outdoor dinner with lights',   'aspect-[3/2]',   true,  4),
  ('Weddings',     'Wedding aisle cypress trees',  'aspect-[3/2]',   false, 5),
  ('Weddings',     'Bride portrait',               'aspect-[2/3]',   false, 6),
  ('Weddings',     'Wedding reception detail',     'aspect-[3/2]',   false, 7),
  ('Portraits',    'Man portrait',                 'aspect-[2/3]',   false, 8),
  ('Family',       'Family portrait',              'aspect-[2/3]',   false, 9),
  ('Graduations',  'Graduation ceremony',          'aspect-[3/2]',   false, 10),
  ('Family',       'Family outdoor session',       'aspect-[3/2]',   false, 11),
  ('Lifestyle',    'Abstract silk fabric',         'aspect-[3/2]',   false, 12),
  ('Lifestyle',    'Editorial portrait',           'aspect-[2/3]',   false, 13);

-- ── Seed — Testimonials ───────────────────────────────────────

TRUNCATE testimonials RESTART IDENTITY CASCADE;
INSERT INTO testimonials (quote, client_name, initials, detail, display_order) VALUES
  (
    'Weddiex captured our day in a way I didn''t think was possible. Looking at the photos feels like living the moment all over again. Pure art.',
    'Eleanor & Markus', 'EM', 'Tuscany, 2023', 1
  ),
  (
    'The level of professionalism and artistic eye is unparalleled. Every single shot is worthy of a gallery wall. Beyond impressed.',
    'Julia R.', 'JR', 'Corporate Gala, 2024', 2
  ),
  (
    'We cried happy tears going through our gallery. The photographer has a gift for capturing the in-between moments that make a wedding real.',
    'Sophia & Daniel', 'SD', 'Amalfi Coast, 2023', 3
  ),
  (
    'Absolute perfection from start to finish. The pre-shoot consultation made us feel completely at ease and it shows in every photo.',
    'Marcus T.', 'MT', 'Graduation, 2024', 4
  );

-- ── Seed — Site Settings ──────────────────────────────────────

INSERT INTO site_settings (key, value) VALUES

  -- Hero section
  ('hero_image_url',           ''),
  ('hero_headline_line1',      'Your Love Story,'),
  ('hero_headline_line2',      'Told in Every'),
  ('hero_headline_line3',      'Frame.'),
  ('hero_subtext',             'Luxury wedding & editorial portraiture for couples who believe their greatest moments deserve to be art.'),
  ('hero_stat1_value',         '200+'),
  ('hero_stat1_label',         'Weddings'),
  ('hero_stat2_value',         '5'),
  ('hero_stat2_label',         'Years'),
  ('hero_stat3_value',         '12'),
  ('hero_stat3_label',         'Awards'),
  ('hero_cta_primary_label',   'View Portfolio'),
  ('hero_cta_primary_href',    '/portfolio'),
  ('hero_cta_secondary_label', 'Book a Session'),
  ('hero_cta_secondary_href',  '/contact'),

  -- Home — Services section
  ('home_services', '{"eyebrow":"Experiences","heading":"Artisan Services","services":[{"title":"Weddings","desc":"Capturing the grand narrative and the quiet whispers of your most important day.","cta_label":"Discover More"},{"title":"Graduations","desc":"Celebrating academic excellence with sophisticated portraits that bridge the gap between student life and professional ambition.","cta_label":"Discover More"},{"title":"Family & Portraits","desc":"Timeless imagery that captures the soul and the bonds of your lineage.","cta_label":"Discover More"},{"title":"Events & Corporate","desc":"Documenting the synergy of high-profile events and the refined identity of modern brands with professional precision.","cta_label":"Discover More"}]}'),

  -- Home — About Teaser (Our Philosophy)
  ('home_about_teaser', '{"eyebrow":"Our Philosophy","quote_main":"We don''t take pictures.","quote_accent":"We preserve feelings.","image_url":"","pillar1_title":"Authenticity","pillar1_desc":"Finding beauty in the unposed and the genuine connections between souls.","pillar2_title":"Artistry","pillar2_desc":"Merging technical precision with a fine-art editorial sensibility.","cta_label":"Meet the Artist"}'),

  -- Services page
  ('services_page', '{"heading":"What We Offer","description":"We believe in the quiet beauty of the in-between moments. Our approach blends fine-art editorial aesthetics with an intimate storytelling perspective, ensuring that every frame captured is a timeless heirloom.","tagline":"Timeless. Intimate. Yours.","services":[{"badge":"Signature Story","title":"Weddings","desc":"Comprehensive coverage of your most significant milestone, captured with a blend of candid emotion and editorial poise.","feature1":"8–12 Hours of coverage with two lead photographers","feature2":"Handcrafted heirloom leather-bound album","feature3":"Private online gallery with full-resolution downloads","cta_label":"Book Wedding","image_url":""},{"badge":"Legacy & Achievement","title":"Graduations","desc":"Celebrating academic excellence with sophisticated portraits that bridge the gap between student life and professional ambition.","feature1":"On-campus or studio locations","feature2":"Professional retouching and color grading","feature3":"Social ready mini edits delivered within 48 hours","cta_label":"Inquire for Graduations","image_url":""},{"badge":"Enduring Bonds","title":"Family & Portraits","desc":"Capturing the evolution of your legacy through timeless family sessions and character-driven personal portraiture.","feature1":"In-home lifestyle sessions or scenic outdoor locations","feature2":"Styling consultation and mood-boarding included","feature3":"Premium fine-art prints available for order","cta_label":"Book Session","image_url":""},{"badge":"Elevate Presence","title":"Events & Corporate","desc":"Documenting the synergy of high-profile events and the refined identity of modern brands with professional precision.","feature1":"Corporate gala and product launch coverage","feature2":"Executive headshots and brand lifestyle content","feature3":"Expedited delivery for press releases","cta_label":"Request Quote","image_url":""},{"badge":"Visionary Narrative","title":"Lifestyle & Editorial","desc":"Crafting visually arresting narratives for publications, brands, and creatives who seek a distinct artistic edge.","feature1":"Concept development and creative direction","feature2":"High-end editorial retouching and color grading","feature3":"Licensing for commercial and editorial use","cta_label":"Inquire for Editorial","image_url":""}]}'),

  -- About page
  ('about_page', '{"eyebrow":"The Vision Behind the Lens","name":"Abeer Sawaan","description":"Curating timeless emotional legacies through the art of fine-art photography. Based in Saudi Arabia, serving a global clientele.","image_url":"","quote":"We don''t take pictures. We preserve feelings.","attribution":"Abeer Sawaan","narrative_1":"My journey into the world of luxury wedding photography didn''t begin with a technical manual, but with a deep-seated fascination for the quiet, unscripted moments that define a lifetime. I believe that a wedding is more than a ceremony; it is an editorial masterpiece waiting to be composed.","narrative_2":"Over the past decade, I have dedicated myself to refining a style that sits at the intersection of high-fashion aesthetics and raw emotional resonance. Each frame is treated as a piece of fine art, meticulously crafted to ensure that the scent of the flowers and the whisper of the vows are felt long after the day has passed.","value1_title":"Authenticity","value1_desc":"Rejecting the staged in favor of the genuine. We capture the true soul of your celebration.","value2_title":"Artistry","value2_desc":"Every image is a curated composition, drawing inspiration from classical painting and modern fashion.","value3_title":"Emotion","value3_desc":"Prioritizing the feeling over the technical. We photograph with the heart, for the heart.","cta_heading":"Begin Your Story","cta_subtext":"Whether it''s an intimate elopement or a grand celebration in Riyadh, let''s create something unforgettable together.","cta_label":"Schedule a Consultation"}'),

  -- Contact page
  ('contact_page', '{"heading":"Let''s Create Something Beautiful","subtext":"Every love story is a unique masterpiece. We are honoured to document yours with the elegance and artistry it deserves.","whatsapp":"905529841249","location":"Based in Saudi Arabia","availability":"Available Worldwide","image_url":""}')

ON CONFLICT (key) DO NOTHING;
