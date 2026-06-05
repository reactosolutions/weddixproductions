'use client'

import { useState } from 'react'
import { FieldText, FieldArea, ImageUploader, cardCls, useSave } from '../_shared/SectionShell'
import type { ServicesPageContent, ServiceArticle } from '@/lib/db/sections'

export default function ServicesPageEditor({ initialData }: { initialData: ServicesPageContent }) {
  const [data, setData] = useState(initialData)
  const { save, saving, msg } = useSave('services_page')

  const setField = (k: keyof ServicesPageContent) => (v: string) => setData((d) => ({ ...d, [k]: v }))
  const setArt = (i: number, k: keyof ServiceArticle) => (v: string) =>
    setData((d) => { const s = [...d.services]; s[i] = { ...s[i], [k]: v }; return { ...d, services: s } })

  return (
    <div className="flex flex-col gap-6">
      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Page Header</h2>
        <div className="flex flex-col gap-4">
          <FieldText label="Heading"     value={data.heading}     onChange={setField('heading')} />
          <FieldArea label="Description" value={data.description} onChange={setField('description')} />
          <FieldText label="Tagline (italic, right side)" value={data.tagline} onChange={setField('tagline')} />
        </div>
      </div>

      {data.services.map((s, i) => (
        <div key={i} className={cardCls}>
          <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Service {i + 1}: {s.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldText label="Badge"  value={s.badge}  onChange={setArt(i, 'badge')} />
                <FieldText label="Title"  value={s.title}  onChange={setArt(i, 'title')} />
              </div>
              <FieldArea label="Description" value={s.desc} onChange={setArt(i, 'desc')} />
              <FieldText label="Feature 1"   value={s.feature1} onChange={setArt(i, 'feature1')} />
              <FieldText label="Feature 2"   value={s.feature2} onChange={setArt(i, 'feature2')} />
              <FieldText label="Feature 3"   value={s.feature3} onChange={setArt(i, 'feature3')} />
              <FieldText label="CTA Label"   value={s.cta_label} onChange={setArt(i, 'cta_label')} />
            </div>
            <ImageUploader label="Photo" value={s.image_url} onUrl={setArt(i, 'image_url')} />
          </div>
        </div>
      ))}

      {msg && <p className="text-sm text-[#8B1535]">{msg}</p>}
      <button onClick={() => save(data)} disabled={saving}
        className="self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
