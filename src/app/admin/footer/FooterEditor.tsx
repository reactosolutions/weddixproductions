'use client'

import { useState } from 'react'
import { FieldText, FieldArea, cardCls, useSave } from '../_shared/SectionShell'
import type { FooterContent } from '@/lib/db/sections'

export default function FooterEditor({ initialData }: { initialData: FooterContent }) {
  const [data, setData] = useState(initialData)
  const { save, saving, msg } = useSave('footer')
  const set = (k: keyof FooterContent) => (v: string) => setData((d) => ({ ...d, [k]: v }))

  return (
    <div className="flex flex-col gap-6">
      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">Footer Text</h2>
        <div className="flex flex-col gap-4">
          <FieldArea label="Tagline" value={data.tagline} onChange={set('tagline')} rows={2} />
          <FieldText label="Copyright Name" value={data.copyright_name} onChange={set('copyright_name')} />
          <p className="text-xs text-[#A8768A]">
            Preview: © {new Date().getFullYear()} {data.copyright_name || '…'}. Fine Art Wedding Photography.
          </p>
        </div>
      </div>

      {msg && <p className="text-sm text-[#8B1535]">{msg}</p>}
      <button
        onClick={() => save(data)}
        disabled={saving}
        className="self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
