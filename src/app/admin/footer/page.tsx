import { createClient } from '@/lib/supabase/server'
import FooterEditor from './FooterEditor'
import type { FooterContent } from '@/lib/db/sections'

const DEFAULTS: FooterContent = {
  tagline: 'A premier photography house dedicated to luxury weddings and editorial portraits.',
  copyright_name: 'Weddix',
}

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'footer')
    .single()

  let footer = DEFAULTS
  if (data?.value) {
    try { footer = { ...DEFAULTS, ...JSON.parse(data.value) } } catch { /* keep defaults */ }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-8">Footer</h1>
      <FooterEditor initialData={footer} />
    </div>
  )
}
