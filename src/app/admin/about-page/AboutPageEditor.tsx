'use client'

import { useState } from 'react'
import { FieldText, FieldArea, ImageUploader, cardCls, useSave } from '../_shared/SectionShell'
import type { AboutPageContent } from '@/lib/db/sections'

export default function AboutPageEditor({ initialData }: { initialData: AboutPageContent }) {
  const [data, setData] = useState(initialData)
  const { save, saving, msg } = useSave('about_page')
  const set = (k: keyof AboutPageContent) => (v: string) => setData((d) => ({ ...d, [k]: v }))

  return (
    <div className="flex flex-col gap-6">

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Hero</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          <div className="flex flex-col gap-4">
            <FieldText label="Eyebrow"               value={data.eyebrow}     onChange={set('eyebrow')} />
            <FieldText label="Photographer Name"     value={data.name}        onChange={set('name')} />
            <FieldArea label="Description"           value={data.description} onChange={set('description')} />
          </div>
          <ImageUploader label="Portrait Photo" value={data.image_url} onUrl={set('image_url')} />
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Pull Quote</h2>
        <div className="flex flex-col gap-4">
          <FieldArea label="Quote"        value={data.quote}       onChange={set('quote')} rows={2} />
          <FieldText label="Attribution"  value={data.attribution} onChange={set('attribution')} />
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">The Narrative</h2>
        <div className="flex flex-col gap-4">
          <FieldArea label="Paragraph 1" value={data.narrative_1} onChange={set('narrative_1')} rows={4} />
          <FieldArea label="Paragraph 2" value={data.narrative_2} onChange={set('narrative_2')} rows={4} />
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Core Values</h2>
        <div className="flex flex-col gap-6">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldText label={`Value ${n} Title`} value={data[`value${n}_title`]} onChange={set(`value${n}_title`)} />
              <FieldArea label={`Value ${n} Description`} value={data[`value${n}_desc`]} onChange={set(`value${n}_desc`)} rows={2} />
            </div>
          ))}
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">CTA Section</h2>
        <div className="flex flex-col gap-4">
          <FieldText label="Heading"     value={data.cta_heading} onChange={set('cta_heading')} />
          <FieldArea label="Subtext"     value={data.cta_subtext} onChange={set('cta_subtext')} />
          <FieldText label="Button Label" value={data.cta_label}  onChange={set('cta_label')} />
        </div>
      </div>

      {msg && <p className="text-sm text-[#8B1535]">{msg}</p>}
      <button onClick={() => save(data)} disabled={saving}
        className="self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
