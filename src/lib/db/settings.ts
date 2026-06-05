import { supabase } from '@/lib/supabase'

export type HeroContent = {
  image_url: string
  headline_line1: string
  headline_line2: string
  headline_line3: string
  subtext: string
  stat1_value: string
  stat1_label: string
  stat2_value: string
  stat2_label: string
  stat3_value: string
  stat3_label: string
  cta_primary_label: string
  cta_primary_href: string
  cta_secondary_label: string
  cta_secondary_href: string
}

const HERO_DEFAULTS: HeroContent = {
  image_url:           '',
  headline_line1:      'Your Love Story,',
  headline_line2:      'Told in Every',
  headline_line3:      'Frame.',
  subtext:             'Luxury wedding & editorial portraiture for couples who believe their greatest moments deserve to be art.',
  stat1_value:         '200+',
  stat1_label:         'Weddings',
  stat2_value:         '5',
  stat2_label:         'Years',
  stat3_value:         '12',
  stat3_label:         'Awards',
  cta_primary_label:   'View Portfolio',
  cta_primary_href:    '/portfolio',
  cta_secondary_label: 'Book a Session',
  cta_secondary_href:  '/contact',
}

export async function getHeroContent(): Promise<HeroContent> {
  const keys = Object.keys(HERO_DEFAULTS).map((k) => `hero_${k}`)
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', keys)

  if (!data || data.length === 0) return HERO_DEFAULTS

  const map = Object.fromEntries(data.map(({ key, value }) => [key.replace('hero_', ''), value]))
  return { ...HERO_DEFAULTS, ...map } as HeroContent
}

export async function saveHeroContent(content: HeroContent): Promise<void> {
  const rows = Object.entries(content).map(([k, v]) => ({ key: `hero_${k}`, value: v ?? '' }))
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) throw new Error(error.message)
}
