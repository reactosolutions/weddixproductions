'use client'

import { useState } from 'react'
import { FieldText, FieldArea, ImageUploader, cardCls, useSave } from '../_shared/SectionShell'
import type { HomeAboutTeaserContent } from '@/lib/db/sections'

export default function AboutTeaserEditor({ initialData }: { initialData: HomeAboutTeaserContent }) {
  const [data, setData] = useState(initialData)
  const { save, saving, msg } = useSave('home_about_teaser')
  const set = (k: keyof HomeAboutTeaserContent) => (v: string) => setData((d) => ({ ...d, [k]: v }))

  return (
    <div className="flex flex-col gap-6">
      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Photo</h2>
        <ImageUploader label="Photographer Photo" value={data.image_url} onUrl={set('image_url')} />
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Quote</h2>
        <div className="flex flex-col gap-4">
          <FieldText label="Eyebrow"       value={data.eyebrow}      onChange={set('eyebrow')} />
          <FieldText label="Quote (main)"  value={data.quote_main}   onChange={set('quote_main')} />
          <FieldText label="Quote (accent — italic wine)" value={data.quote_accent} onChange={set('quote_accent')} />
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {([1, 2] as const).map((n) => (
            <div key={n} className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-[#5A3A44]">Pillar {n}</p>
              <FieldText label="Title" value={data[`pillar${n}_title`]} onChange={set(`pillar${n}_title`)} />
              <FieldArea label="Description" value={data[`pillar${n}_desc`]} onChange={set(`pillar${n}_desc`)} />
            </div>
          ))}
        </div>
      </div>

      <div className={cardCls}>
        <FieldText label="CTA Button Label" value={data.cta_label} onChange={set('cta_label')} />
      </div>

      {msg && <p className="text-sm text-[#8B1535]">{msg}</p>}
      <button onClick={() => save(data)} disabled={saving}
        className="self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
