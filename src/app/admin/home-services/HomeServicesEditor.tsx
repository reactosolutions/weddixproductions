'use client'

import { useState } from 'react'
import { FieldText, FieldArea, cardCls, useSave } from '../_shared/SectionShell'
import type { HomeServicesContent, ServiceItem } from '@/lib/db/sections'

export default function HomeServicesEditor({ initialData }: { initialData: HomeServicesContent }) {
  const [data, setData] = useState(initialData)
  const { save, saving, msg } = useSave('home_services')

  const setField = (k: keyof HomeServicesContent) => (v: string) => setData((d) => ({ ...d, [k]: v }))
  const setService = (i: number, k: keyof ServiceItem) => (v: string) =>
    setData((d) => { const s = [...d.services]; s[i] = { ...s[i], [k]: v }; return { ...d, services: s } })

  return (
    <div className="flex flex-col gap-6">
      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Section Header</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldText label="Eyebrow"  value={data.eyebrow}  onChange={setField('eyebrow')} />
          <FieldText label="Heading" value={data.heading} onChange={setField('heading')} />
        </div>
      </div>

      {data.services.map((s, i) => (
        <div key={i} className={cardCls}>
          <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Service {i + 1}: {s.title}</h2>
          <div className="flex flex-col gap-4">
            <FieldText label="Title"     value={s.title}     onChange={setService(i, 'title')} />
            <FieldArea label="Description" value={s.desc}    onChange={setService(i, 'desc')} />
            <FieldText label="CTA Label" value={s.cta_label} onChange={setService(i, 'cta_label')} />
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
