'use client'

import { useState } from 'react'
import { FieldText, cardCls, useSave } from '../_shared/SectionShell'
import type { SocialLinksContent } from '@/lib/db/sections'

const platforms: { key: keyof SocialLinksContent; label: string; placeholder: string }[] = [
  { key: 'instagram', label: 'Instagram',  placeholder: 'https://instagram.com/yourhandle' },
  { key: 'facebook',  label: 'Facebook',   placeholder: 'https://facebook.com/yourpage'   },
  { key: 'tiktok',    label: 'TikTok',     placeholder: 'https://tiktok.com/@yourhandle'  },
  { key: 'pinterest', label: 'Pinterest',  placeholder: 'https://pinterest.com/yourprofile' },
  { key: 'youtube',   label: 'YouTube',    placeholder: 'https://youtube.com/@yourchannel' },
]

export default function SocialLinksEditor({ initialData }: { initialData: SocialLinksContent }) {
  const [data, setData] = useState(initialData)
  const { save, saving, msg } = useSave('social_links')
  const set = (k: keyof SocialLinksContent) => (v: string) => setData((d) => ({ ...d, [k]: v }))

  return (
    <div className="flex flex-col gap-6">
      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-1">Social Media Links</h2>
        <p className="text-xs text-[#A8768A] mb-5">Paste the full URL for each platform. Leave blank to hide.</p>
        <div className="flex flex-col gap-4">
          {platforms.map(({ key, label, placeholder }) => (
            <FieldText key={key} label={label} value={data[key]} onChange={set(key)} />
          ))}
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
