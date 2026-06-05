'use client'

import { useState } from 'react'
import { FieldText, FieldArea, ImageUploader, cardCls, useSave } from '../_shared/SectionShell'
import type { ContactPageContent } from '@/lib/db/sections'

export default function ContactPageEditor({ initialData }: { initialData: ContactPageContent }) {
  const [data, setData] = useState(initialData)
  const { save, saving, msg } = useSave('contact_page')
  const set = (k: keyof ContactPageContent) => (v: string) => setData((d) => ({ ...d, [k]: v }))

  return (
    <div className="flex flex-col gap-6">

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Hero Text</h2>
        <div className="flex flex-col gap-4">
          <FieldText label="Heading" value={data.heading} onChange={set('heading')} />
          <FieldArea label="Subtext" value={data.subtext} onChange={set('subtext')} />
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Contact Details</h2>
        <div className="flex flex-col gap-4">
          <FieldText label="WhatsApp Number (digits only, e.g. 905529841249)" value={data.whatsapp}     onChange={set('whatsapp')} />
          <FieldText label="Location"                                          value={data.location}     onChange={set('location')} />
          <FieldText label="Availability"                                      value={data.availability} onChange={set('availability')} />
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-1">Notification Email</h2>
        <p className="text-xs text-[#A8768A] mb-4">Contact form submissions will be sent to this address.</p>
        <FieldText label="Recipient Email" value={data.notification_email} onChange={set('notification_email')} />
      </div>

      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-4">Photo (right side)</h2>
        <ImageUploader label="Stationery / Couple Photo" value={data.image_url} onUrl={set('image_url')} />
      </div>

      {msg && <p className="text-sm text-[#8B1535]">{msg}</p>}
      <button onClick={() => save(data)} disabled={saving}
        className="self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
