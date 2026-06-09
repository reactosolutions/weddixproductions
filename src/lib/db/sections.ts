import { supabase } from '@/lib/supabase'

// ── Generic helper ────────────────────────────────────────────────────────────

async function getSection<T>(key: string, defaults: T): Promise<T> {
  try {
    const { data } = await supabase.from('site_settings').select('value').eq('key', key).single()
    if (!data?.value) return defaults
    return { ...defaults, ...JSON.parse(data.value) } as T
  } catch { return defaults }
}

async function saveSection(key: string, value: unknown): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value: JSON.stringify(value) }, { onConflict: 'key' })
  if (error) throw new Error(error.message)
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ServiceItem = { title: string; desc: string; cta_label: string }

export type HomeServicesContent = {
  eyebrow: string
  heading: string
  services: ServiceItem[]
}

export type HomeAboutTeaserContent = {
  eyebrow: string
  quote_main: string
  quote_accent: string
  image_url: string
  pillar1_title: string; pillar1_desc: string
  pillar2_title: string; pillar2_desc: string
  cta_label: string
}

export type ServiceArticle = {
  badge: string; title: string; desc: string
  feature1: string; feature2: string; feature3: string
  cta_label: string; image_url: string
}

export type ServicesPageContent = {
  heading: string
  description: string
  tagline: string
  services: ServiceArticle[]
}

export type AboutPageContent = {
  eyebrow: string; name: string; description: string; image_url: string
  quote: string; attribution: string
  narrative_1: string; narrative_2: string
  value1_title: string; value1_desc: string
  value2_title: string; value2_desc: string
  value3_title: string; value3_desc: string
  cta_heading: string; cta_subtext: string; cta_label: string
}

export type SocialLinksContent = {
  instagram: string
  facebook: string
  tiktok: string
  pinterest: string
  youtube: string
}

export type ContactPageContent = {
  heading: string; subtext: string
  whatsapp: string; location: string; availability: string
  image_url: string
  notification_email: string
}

export type FooterContent = {
  tagline: string
  copyright_name: string
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const HOME_SERVICES_DEFAULTS: HomeServicesContent = {
  eyebrow: 'Experiences', heading: 'Artisan Services',
  services: [
    { title: 'Weddings',           desc: 'Capturing the grand narrative and the quiet whispers of your most important day.',                                                  cta_label: 'Discover More' },
    { title: 'Graduations',        desc: 'Celebrating academic excellence with sophisticated portraits that bridge the gap between student life and professional ambition.',  cta_label: 'Discover More' },
    { title: 'Family & Portraits', desc: 'Timeless imagery that captures the soul and the bonds of your lineage.',                                                            cta_label: 'Discover More' },
    { title: 'Events & Corporate', desc: 'Documenting the synergy of high-profile events and the refined identity of modern brands with professional precision.',             cta_label: 'Discover More' },
  ],
}

const HOME_ABOUT_TEASER_DEFAULTS: HomeAboutTeaserContent = {
  eyebrow: 'Our Philosophy', quote_main: "We don't take pictures.", quote_accent: 'We preserve feelings.',
  image_url: '', pillar1_title: 'Authenticity', pillar1_desc: 'Finding beauty in the unposed and the genuine connections between souls.',
  pillar2_title: 'Artistry', pillar2_desc: 'Merging technical precision with a fine-art editorial sensibility.', cta_label: 'Meet the Artist',
}

const SERVICES_PAGE_DEFAULTS: ServicesPageContent = {
  heading: 'What We Offer', description: 'We believe in the quiet beauty of the in-between moments. Our approach blends fine-art editorial aesthetics with an intimate storytelling perspective.', tagline: 'Timeless. Intimate. Yours.',
  services: [
    { badge: 'Signature Story',     title: 'Weddings',             desc: 'Comprehensive coverage of your most significant milestone.', feature1: '8–12 Hours of coverage', feature2: 'Handcrafted heirloom album', feature3: 'Private online gallery', cta_label: 'Book Wedding',             image_url: '' },
    { badge: 'Legacy & Achievement',title: 'Graduations',          desc: 'Celebrating academic excellence with sophisticated portraits.', feature1: 'On-campus or studio', feature2: 'Professional retouching', feature3: 'Social edits in 48 hours', cta_label: 'Inquire for Graduations',   image_url: '' },
    { badge: 'Enduring Bonds',      title: 'Family & Portraits',   desc: 'Capturing the evolution of your legacy through timeless sessions.', feature1: 'Lifestyle or outdoor', feature2: 'Styling consultation', feature3: 'Fine-art prints available', cta_label: 'Book Session',             image_url: '' },
    { badge: 'Elevate Presence',    title: 'Events & Corporate',   desc: 'Documenting high-profile events with professional precision.', feature1: 'Corporate gala coverage', feature2: 'Executive headshots', feature3: 'Expedited delivery', cta_label: 'Request Quote',            image_url: '' },
    { badge: 'Visionary Narrative', title: 'Lifestyle & Editorial',desc: 'Crafting visually arresting narratives for publications and brands.', feature1: 'Concept development', feature2: 'High-end retouching', feature3: 'Commercial licensing', cta_label: 'Inquire for Editorial',   image_url: '' },
  ],
}

const ABOUT_PAGE_DEFAULTS: AboutPageContent = {
  eyebrow: 'The Vision Behind the Lens', name: 'Abeer Sawaan', description: 'Curating timeless emotional legacies through the art of fine-art photography. Based in Saudi Arabia, serving a global clientele.', image_url: '',
  quote: "We don't take pictures. We preserve feelings.", attribution: 'Abeer Sawaan',
  narrative_1: "My journey into the world of luxury wedding photography didn't begin with a technical manual, but with a deep-seated fascination for the quiet, unscripted moments that define a lifetime.",
  narrative_2: 'Over the past decade, I have dedicated myself to refining a style that sits at the intersection of high-fashion aesthetics and raw emotional resonance.',
  value1_title: 'Authenticity', value1_desc: 'Rejecting the staged in favor of the genuine. We capture the true soul of your celebration.',
  value2_title: 'Artistry',     value2_desc: 'Every image is a curated composition, drawing inspiration from classical painting and modern fashion.',
  value3_title: 'Emotion',      value3_desc: 'Prioritizing the feeling over the technical. We photograph with the heart, for the heart.',
  cta_heading: 'Begin Your Story', cta_subtext: "Whether it's an intimate elopement or a grand celebration in Riyadh, let's create something unforgettable together.", cta_label: 'Schedule a Consultation',
}

const SOCIAL_LINKS_DEFAULTS: SocialLinksContent = {
  instagram: '', facebook: '', tiktok: '', pinterest: '', youtube: '',
}

const FOOTER_DEFAULTS: FooterContent = {
  tagline: 'A premier photography house dedicated to luxury weddings and editorial portraits.',
  copyright_name: 'Weddix',
}

const CONTACT_PAGE_DEFAULTS: ContactPageContent = {
  heading: "Let's Create Something Beautiful", subtext: 'Every love story is a unique masterpiece. We are honoured to document yours with the elegance and artistry it deserves.',
  whatsapp: '905529841249', location: 'Based in Saudi Arabia', availability: 'Available Worldwide', image_url: '',
  notification_email: '',
}

// ── Public API ────────────────────────────────────────────────────────────────

export const getHomeServices      = () => getSection('home_services',      HOME_SERVICES_DEFAULTS)
export const getHomeAboutTeaser   = () => getSection('home_about_teaser',  HOME_ABOUT_TEASER_DEFAULTS)
export const getServicesPage      = () => getSection('services_page',      SERVICES_PAGE_DEFAULTS)
export const getAboutPage         = () => getSection('about_page',         ABOUT_PAGE_DEFAULTS)
export const getSocialLinks       = () => getSection('social_links',       SOCIAL_LINKS_DEFAULTS)
export const getContactPage       = () => getSection('contact_page',       CONTACT_PAGE_DEFAULTS)
export const getFooter            = () => getSection('footer',             FOOTER_DEFAULTS)

export const saveHomeServices     = (v: HomeServicesContent)     => saveSection('home_services',      v)
export const saveHomeAboutTeaser  = (v: HomeAboutTeaserContent)  => saveSection('home_about_teaser',  v)
export const saveServicesPage     = (v: ServicesPageContent)     => saveSection('services_page',      v)
export const saveAboutPage        = (v: AboutPageContent)        => saveSection('about_page',         v)
export const saveContactPage      = (v: ContactPageContent)      => saveSection('contact_page',       v)
