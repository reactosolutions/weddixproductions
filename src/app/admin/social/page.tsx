import { createClient } from '@/lib/supabase/server'
import SocialLinksEditor from './SocialLinksEditor'
import type { SocialLinksContent } from '@/lib/db/sections'

const DEFAULTS: SocialLinksContent = {
  instagram: '', facebook: '', tiktok: '', pinterest: '', youtube: '',
}

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'social_links')
    .single()

  let social = DEFAULTS
  if (data?.value) {
    try { social = { ...DEFAULTS, ...JSON.parse(data.value) } } catch { /* keep defaults */ }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-8">Social Links</h1>
      <SocialLinksEditor initialData={social} />
    </div>
  )
}
