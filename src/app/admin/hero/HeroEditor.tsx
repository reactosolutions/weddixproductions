'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/browser'
import type { HeroContent } from '@/lib/db/settings'

export default function HeroEditor({ initialHero }: { initialHero: HeroContent }) {
  const router   = useRouter()
  const supabase = createClient()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [hero, setHero]         = useState(initialHero)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg]           = useState('')

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 4000) }
  const set = (k: keyof HeroContent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setHero((h) => ({ ...h, [k]: e.target.value }))

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `hero-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: true })
    if (error) { flash(error.message); setUploading(false); return }
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    setHero((h) => ({ ...h, image_url: data.publicUrl }))
    setUploading(false)
    flash('Image uploaded')
  }

  async function handleSave() {
    setSaving(true)
    const rows = Object.entries(hero).map(([k, v]) => ({ key: `hero_${k}`, value: v ?? '' }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    if (error) { flash(error.message); setSaving(false); return }
    flash('Saved — revalidating…')
    await fetch('/api/revalidate', { method: 'POST' }).catch(() => null)
    router.refresh()
    setSaving(false)
  }

  const inputCls = 'border border-[#D4C5BE] bg-white px-3 py-2 text-sm text-[#2A1018] focus:outline-none focus:border-[#8B1535] transition-colors w-full'
  const label = (text: string) => (
    <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">{text}</label>
  )

  return (
    <div className="flex flex-col gap-6">

      {/* ── Hero Photo ── */}
      <div className="bg-white border border-[#E8E0DC] p-6">
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">Hero Photo</h2>
        <div className="flex items-start gap-6 flex-wrap">

          {/* Preview */}
          <div className="relative w-48 aspect-[3/4] bg-[#D4C5BE] overflow-hidden border border-[#E8E0DC] shrink-0">
            {hero.image_url ? (
              <Image src={hero.image_url} alt="Hero preview" fill className="object-cover" sizes="192px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="opacity-30">
                  <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
                  <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
                  <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
                  <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="border border-[#D4C5BE] text-xs text-[#5A3A44] px-4 h-9 hover:border-[#8B1535] hover:text-[#8B1535] transition-colors disabled:opacity-50">
              {uploading ? 'Uploading…' : hero.image_url ? 'Change Photo' : 'Upload Photo'}
            </button>
            {hero.image_url && (
              <button onClick={() => setHero((h) => ({ ...h, image_url: '' }))}
                className="text-xs text-red-400 hover:text-red-600 transition-colors text-left">
                Remove Photo
              </button>
            )}
            <p className="text-xs text-[#A8768A] max-w-xs">Recommended: portrait orientation, min 800 × 1200 px.</p>
          </div>
        </div>
      </div>

      {/* ── Headline ── */}
      <div className="bg-white border border-[#E8E0DC] p-6">
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">Headline</h2>
        <div className="flex flex-col gap-4">
          <div>{label('Line 1')}<input type="text" value={hero.headline_line1} onChange={set('headline_line1')} className={inputCls} /></div>
          <div>{label('Line 2')}<input type="text" value={hero.headline_line2} onChange={set('headline_line2')} className={inputCls} /></div>
          <div>
            {label('Line 3 (italic accent)')}
            <input type="text" value={hero.headline_line3} onChange={set('headline_line3')} className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Subtext ── */}
      <div className="bg-white border border-[#E8E0DC] p-6">
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">Subtext</h2>
        <textarea rows={3} value={hero.subtext} onChange={set('subtext')} className={`${inputCls} resize-none`} />
      </div>

      {/* ── Stats ── */}
      <div className="bg-white border border-[#E8E0DC] p-6">
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="flex flex-col gap-3">
              <div>
                {label(`Stat ${n} Value`)}
                <input type="text" value={hero[`stat${n}_value`]} onChange={set(`stat${n}_value`)} className={inputCls} />
              </div>
              <div>
                {label(`Stat ${n} Label`)}
                <input type="text" value={hero[`stat${n}_label`]} onChange={set(`stat${n}_label`)} className={inputCls} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTAs ── */}
      <div className="bg-white border border-[#E8E0DC] p-6">
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">Call-to-Action Buttons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-[#5A3A44]">Primary (filled)</p>
            <div>{label('Label')}<input type="text" value={hero.cta_primary_label} onChange={set('cta_primary_label')} className={inputCls} /></div>
            <div>{label('URL / Path')}<input type="text" value={hero.cta_primary_href} onChange={set('cta_primary_href')} className={inputCls} /></div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-[#5A3A44]">Secondary (outlined)</p>
            <div>{label('Label')}<input type="text" value={hero.cta_secondary_label} onChange={set('cta_secondary_label')} className={inputCls} /></div>
            <div>{label('URL / Path')}<input type="text" value={hero.cta_secondary_href} onChange={set('cta_secondary_href')} className={inputCls} /></div>
          </div>
        </div>
      </div>

      {/* ── Save ── */}
      {msg && <p className="text-sm text-[#8B1535]">{msg}</p>}
      <button onClick={handleSave} disabled={saving}
        className="self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>

    </div>
  )
}
