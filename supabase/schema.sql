-- ============================================================
--  Weddix — Supabase Schema
--  Run in: Supabase Dashboard → SQL Editor
--  Idempotent: safe to re-run — uses IF NOT EXISTS / OR REPLACE
--  and drops old conflicting tables at the top.
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


-- ── Drop old tables replaced by this schema ───────────────────
-- gallery_items is superseded by gallery_images
-- old testimonials/site_settings had different column structures

DROP TABLE IF EXISTS public.gallery_items   CASCADE;
DROP TABLE IF EXISTS public.gallery_images  CASCADE;
DROP TABLE IF EXISTS public.testimonials    CASCADE;
DROP TABLE IF EXISTS public.site_settings   CASCADE;


-- ── UTILITY: set_updated_at() ─────────────────────────────────
-- Bumps updated_at on every UPDATE. Applied to all tables below.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ============================================================
-- TABLE 1: profiles
-- Extends auth.users with a role and display name.
-- One row is auto-created per user via the trigger below.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'user'
                          CHECK (role IN ('admin', 'user', 'customer')),
  full_name   text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: own read"       ON public.profiles;
DROP POLICY IF EXISTS "profiles: own update"     ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin read all" ON public.profiles;

CREATE POLICY "profiles: own read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING    (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- "profiles: admin read all" is added further down, after is_admin() is defined

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create a profile row whenever a new user signs up.
-- Fires AFTER INSERT on auth.users for every sign-up method
-- (email/password, OAuth, magic link, etc.).
-- SECURITY DEFINER gives it write access to public.profiles
-- regardless of the caller's RLS context.
-- raw_user_meta_data is the JSON passed as options.data in signUp().

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── HELPER: is_admin() ────────────────────────────────────────
-- Defined here (after profiles exists) so PostgreSQL can resolve
-- the table reference at function-creation time.
-- SECURITY DEFINER bypasses RLS on profiles — prevents the
-- infinite recursion that would occur if an RLS policy on
-- profiles called a function that re-queries profiles under RLS.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.profiles
    WHERE  id   = auth.uid()
    AND    role = 'admin'
  );
$$;

-- Now safe to add the admin policy on profiles (is_admin() exists)
CREATE POLICY "profiles: admin read all"
  ON public.profiles FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- TABLE 2: services
-- Photography / agency services shown on the homepage and
-- individual service pages.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.services (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  slug         text        UNIQUE NOT NULL,
  description  text,
  image_url    text,
  order_index  integer     NOT NULL DEFAULT 0,
  is_active    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services: public read active" ON public.services;
DROP POLICY IF EXISTS "services: admin insert"       ON public.services;
DROP POLICY IF EXISTS "services: admin update"       ON public.services;
DROP POLICY IF EXISTS "services: admin delete"       ON public.services;

CREATE POLICY "services: public read active"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "services: admin insert"
  ON public.services FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "services: admin update"
  ON public.services FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "services: admin delete"
  ON public.services FOR DELETE
  USING (public.is_admin());

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- TABLE 3: hero_slides
-- Slides for the homepage hero carousel.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hero_slides (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  subtitle     text,
  image_url    text,
  action_label text,
  action_url   text,
  order_index  integer     NOT NULL DEFAULT 0,
  is_active    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hero_slides: public read active" ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides: admin insert"       ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides: admin update"       ON public.hero_slides;
DROP POLICY IF EXISTS "hero_slides: admin delete"       ON public.hero_slides;

CREATE POLICY "hero_slides: public read active"
  ON public.hero_slides FOR SELECT
  USING (is_active = true);

CREATE POLICY "hero_slides: admin insert"
  ON public.hero_slides FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "hero_slides: admin update"
  ON public.hero_slides FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "hero_slides: admin delete"
  ON public.hero_slides FOR DELETE
  USING (public.is_admin());

DROP TRIGGER IF EXISTS set_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER set_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- TABLE 4: testimonials
-- Client testimonials shown on the website.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name       text        NOT NULL,
  client_title      text,
  client_avatar_url text,
  content           text        NOT NULL,
  rating            integer     CHECK (rating BETWEEN 1 AND 5),
  is_active         boolean     NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials: public read active" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials: admin insert"       ON public.testimonials;
DROP POLICY IF EXISTS "testimonials: admin update"       ON public.testimonials;
DROP POLICY IF EXISTS "testimonials: admin delete"       ON public.testimonials;

CREATE POLICY "testimonials: public read active"
  ON public.testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "testimonials: admin insert"
  ON public.testimonials FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "testimonials: admin update"
  ON public.testimonials FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "testimonials: admin delete"
  ON public.testimonials FOR DELETE
  USING (public.is_admin());

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- TABLE 5: portfolio
-- Work / case studies with a cover image and optional gallery.
-- gallery_urls and tags are native Postgres text[] arrays.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.portfolio (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text        NOT NULL,
  slug             text        UNIQUE NOT NULL,
  description      text,
  cover_image_url  text,
  gallery_urls     text[]      NOT NULL DEFAULT '{}',
  project_url      text,
  tags             text[]      NOT NULL DEFAULT '{}',
  is_active        boolean     NOT NULL DEFAULT true,
  order_index      integer     NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio: public read active" ON public.portfolio;
DROP POLICY IF EXISTS "portfolio: admin insert"       ON public.portfolio;
DROP POLICY IF EXISTS "portfolio: admin update"       ON public.portfolio;
DROP POLICY IF EXISTS "portfolio: admin delete"       ON public.portfolio;

CREATE POLICY "portfolio: public read active"
  ON public.portfolio FOR SELECT
  USING (is_active = true);

CREATE POLICY "portfolio: admin insert"
  ON public.portfolio FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "portfolio: admin update"
  ON public.portfolio FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "portfolio: admin delete"
  ON public.portfolio FOR DELETE
  USING (public.is_admin());

DROP TRIGGER IF EXISTS set_portfolio_updated_at ON public.portfolio;
CREATE TRIGGER set_portfolio_updated_at
  BEFORE UPDATE ON public.portfolio
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- TABLE 6: site_settings
-- Global key-value config: branding, contact, social, copy.
-- "group" is a reserved SQL word — quoted throughout.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text        UNIQUE NOT NULL,
  value       text,
  label       text,
  "group"     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings: public read"    ON public.site_settings;
DROP POLICY IF EXISTS "site_settings: admin insert"   ON public.site_settings;
DROP POLICY IF EXISTS "site_settings: admin update"   ON public.site_settings;
DROP POLICY IF EXISTS "site_settings: admin delete"   ON public.site_settings;

CREATE POLICY "site_settings: public read"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "site_settings: admin insert"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "site_settings: admin update"
  ON public.site_settings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "site_settings: admin delete"
  ON public.site_settings FOR DELETE
  USING (public.is_admin());

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- TABLE 7: gallery_images
-- Images for the dedicated /gallery page.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url    text,
  caption      text,
  category     text        NOT NULL DEFAULT 'Weddings',
  aspect       text        NOT NULL DEFAULT 'aspect-[2/3]',
  media_type   text        NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  featured     boolean     NOT NULL DEFAULT false,
  order_index  integer     NOT NULL DEFAULT 0,
  is_active    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gallery_images: public read active" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_images: admin insert"       ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_images: admin update"       ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_images: admin delete"       ON public.gallery_images;

CREATE POLICY "gallery_images: public read active"
  ON public.gallery_images FOR SELECT
  USING (is_active = true);

CREATE POLICY "gallery_images: admin insert"
  ON public.gallery_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "gallery_images: admin update"
  ON public.gallery_images FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "gallery_images: admin delete"
  ON public.gallery_images FOR DELETE
  USING (public.is_admin());

DROP TRIGGER IF EXISTS set_gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER set_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── Seed — Testimonials ───────────────────────────────────────

INSERT INTO public.testimonials (client_name, client_title, content, rating) VALUES
  (
    'Eleanor & Markus',
    'Tuscany Wedding, 2023',
    'Weddiex captured our day in a way I didn''t think was possible. Looking at the photos feels like living the moment all over again. Pure art.',
    5
  ),
  (
    'Julia R.',
    'Corporate Gala, 2024',
    'The level of professionalism and artistic eye is unparalleled. Every single shot is worthy of a gallery wall. Beyond impressed.',
    5
  ),
  (
    'Sophia & Daniel',
    'Amalfi Coast Wedding, 2023',
    'We cried happy tears going through our gallery. The photographer has a gift for capturing the in-between moments that make a wedding real.',
    5
  ),
  (
    'Marcus T.',
    'Graduation, 2024',
    'Absolute perfection from start to finish. The pre-shoot consultation made us feel completely at ease and it shows in every photo.',
    5
  );


-- ── Seed — Site Settings ──────────────────────────────────────

INSERT INTO public.site_settings (key, value, label, "group") VALUES

  -- Branding
  ('logo_url',              '',  'Logo URL',              'branding'),

  -- Contact
  ('contact_email',         '',  'Contact Email',         'contact'),
  ('contact_phone',         '',  'Contact Phone',         'contact'),
  ('contact_address',       '',  'Contact Address',       'contact'),
  ('contact_whatsapp',      '',  'WhatsApp Number',       'contact'),
  ('contact_location',      '',  'Location Label',        'contact'),
  ('contact_availability',  '',  'Availability Label',    'contact'),

  -- Social (JSON blob read by the social links editor)
  ('social_links', '{"instagram":"","facebook":"","tiktok":"","pinterest":"","youtube":""}', 'Social Links', 'social'),

  -- Hero section
  ('hero_image_url',        '',                                    'Hero Background Image',   'hero'),
  ('hero_headline_line1',   'Your Love Story,',                    'Headline Line 1',         'hero'),
  ('hero_headline_line2',   'Told in Every',                       'Headline Line 2',         'hero'),
  ('hero_headline_line3',   'Frame.',                              'Headline Line 3',         'hero'),
  ('hero_subtext',          'Luxury wedding & editorial portraiture for couples who believe their greatest moments deserve to be art.',
                                                                   'Hero Subtext',            'hero'),
  ('hero_stat1_value',      '200+',  'Stat 1 Value',              'hero'),
  ('hero_stat1_label',      'Weddings',  'Stat 1 Label',          'hero'),
  ('hero_stat2_value',      '5',     'Stat 2 Value',              'hero'),
  ('hero_stat2_label',      'Years',     'Stat 2 Label',          'hero'),
  ('hero_stat3_value',      '12',    'Stat 3 Value',              'hero'),
  ('hero_stat3_label',      'Awards',    'Stat 3 Label',          'hero'),
  ('hero_cta_primary_label',    'View Portfolio',  'Primary CTA Label',    'hero'),
  ('hero_cta_primary_href',     '/portfolio',      'Primary CTA Link',     'hero'),
  ('hero_cta_secondary_label',  'Book a Session',  'Secondary CTA Label',  'hero'),
  ('hero_cta_secondary_href',   '/contact',        'Secondary CTA Link',   'hero'),

  -- Text / copy blocks
  ('footer_text',     '',  'Footer Text',       'text'),
  ('about_text',      '',  'About Us Text',     'text'),

  -- Page content blocks (JSON)
  ('home_services',     '{"eyebrow":"Experiences","heading":"Artisan Services","services":[{"title":"Weddings","desc":"Capturing the grand narrative and the quiet whispers of your most important day.","cta_label":"Discover More"},{"title":"Graduations","desc":"Celebrating academic excellence with sophisticated portraits that bridge the gap between student life and professional ambition.","cta_label":"Discover More"},{"title":"Family & Portraits","desc":"Timeless imagery that captures the soul and the bonds of your lineage.","cta_label":"Discover More"},{"title":"Events & Corporate","desc":"Documenting the synergy of high-profile events and the refined identity of modern brands with professional precision.","cta_label":"Discover More"}]}',
    'Home — Services Block', 'pages'),

  ('home_about_teaser', '{"eyebrow":"Our Philosophy","quote_main":"We don''t take pictures.","quote_accent":"We preserve feelings.","image_url":"","pillar1_title":"Authenticity","pillar1_desc":"Finding beauty in the unposed and the genuine connections between souls.","pillar2_title":"Artistry","pillar2_desc":"Merging technical precision with a fine-art editorial sensibility.","cta_label":"Meet the Artist"}',
    'Home — About Teaser Block', 'pages'),

  ('services_page',     '{"heading":"What We Offer","description":"We believe in the quiet beauty of the in-between moments. Our approach blends fine-art editorial aesthetics with an intimate storytelling perspective, ensuring that every frame captured is a timeless heirloom.","tagline":"Timeless. Intimate. Yours.","services":[{"badge":"Signature Story","title":"Weddings","desc":"Comprehensive coverage of your most significant milestone, captured with a blend of candid emotion and editorial poise.","feature1":"8–12 Hours of coverage with two lead photographers","feature2":"Handcrafted heirloom leather-bound album","feature3":"Private online gallery with full-resolution downloads","cta_label":"Book Wedding","image_url":""},{"badge":"Legacy & Achievement","title":"Graduations","desc":"Celebrating academic excellence with sophisticated portraits that bridge the gap between student life and professional ambition.","feature1":"On-campus or studio locations","feature2":"Professional retouching and color grading","feature3":"Social ready mini edits delivered within 48 hours","cta_label":"Inquire for Graduations","image_url":""},{"badge":"Enduring Bonds","title":"Family & Portraits","desc":"Capturing the evolution of your legacy through timeless family sessions and character-driven personal portraiture.","feature1":"In-home lifestyle sessions or scenic outdoor locations","feature2":"Styling consultation and mood-boarding included","feature3":"Premium fine-art prints available for order","cta_label":"Book Session","image_url":""},{"badge":"Elevate Presence","title":"Events & Corporate","desc":"Documenting the synergy of high-profile events and the refined identity of modern brands with professional precision.","feature1":"Corporate gala and product launch coverage","feature2":"Executive headshots and brand lifestyle content","feature3":"Expedited delivery for press releases","cta_label":"Request Quote","image_url":""},{"badge":"Visionary Narrative","title":"Lifestyle & Editorial","desc":"Crafting visually arresting narratives for publications, brands, and creatives who seek a distinct artistic edge.","feature1":"Concept development and creative direction","feature2":"High-end editorial retouching and color grading","feature3":"Licensing for commercial and editorial use","cta_label":"Inquire for Editorial","image_url":""}]}',
    'Services Page Block', 'pages'),

  ('about_page',        '{"eyebrow":"The Vision Behind the Lens","name":"Abeer Sawaan","description":"Curating timeless emotional legacies through the art of fine-art photography. Based in Saudi Arabia, serving a global clientele.","image_url":"","quote":"We don''t take pictures. We preserve feelings.","attribution":"Abeer Sawaan","narrative_1":"My journey into the world of luxury wedding photography didn''t begin with a technical manual, but with a deep-seated fascination for the quiet, unscripted moments that define a lifetime. I believe that a wedding is more than a ceremony; it is an editorial masterpiece waiting to be composed.","narrative_2":"Over the past decade, I have dedicated myself to refining a style that sits at the intersection of high-fashion aesthetics and raw emotional resonance. Each frame is treated as a piece of fine art, meticulously crafted to ensure that the scent of the flowers and the whisper of the vows are felt long after the day has passed.","value1_title":"Authenticity","value1_desc":"Rejecting the staged in favor of the genuine. We capture the true soul of your celebration.","value2_title":"Artistry","value2_desc":"Every image is a curated composition, drawing inspiration from classical painting and modern fashion.","value3_title":"Emotion","value3_desc":"Prioritizing the feeling over the technical. We photograph with the heart, for the heart.","cta_heading":"Begin Your Story","cta_subtext":"Whether it''s an intimate elopement or a grand celebration in Riyadh, let''s create something unforgettable together.","cta_label":"Schedule a Consultation"}',
    'About Page Block', 'pages'),

  ('contact_page',      '{"heading":"Let''s Create Something Beautiful","subtext":"Every love story is a unique masterpiece. We are honoured to document yours with the elegance and artistry it deserves.","whatsapp":"905529841249","location":"Based in Saudi Arabia","availability":"Available Worldwide","image_url":""}',
    'Contact Page Block', 'pages'),

  ('footer', '{"tagline":"A premier photography house dedicated to luxury weddings and editorial portraits.","copyright_name":"Weddix"}',
    'Footer Content', 'pages')

ON CONFLICT (key) DO NOTHING;
