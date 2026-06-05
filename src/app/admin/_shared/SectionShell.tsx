'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { useState, useRef } from 'react'

export const inputCls = 'border border-[#D4C5BE] bg-white px-3 py-2 text-sm text-[#2A1018] focus:outline-none focus:border-[#8B1535] transition-colors w-full'
export const labelCls = 'block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1'
export const cardCls  = 'bg-white border border-[#E8E0DC] p-6'

export function FieldText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  )
}

export function FieldArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-none`} />
    </div>
  )
}

export function useImageUpload(onUrl: (url: string) => void) {
  const supabase    = createClient()
  const fileRef     = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: true })
    if (error) { setUploadMsg(error.message); setUploading(false); return }
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    onUrl(data.publicUrl)
    setUploading(false)
    setUploadMsg('Uploaded')
    setTimeout(() => setUploadMsg(''), 3000)
  }

  return { fileRef, uploading, uploadMsg, handleFile }
}

export function ImageUploader({ label, value, onUrl }: { label: string; value: string; onUrl: (url: string) => void }) {
  const { fileRef, uploading, uploadMsg, handleFile } = useImageUpload(onUrl)
  return (
    <div className="flex flex-col gap-2">
      <span className={labelCls}>{label}</span>
      {value && <img src={value} alt="" className="w-32 h-20 object-cover border border-[#E8E0DC]" />}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
        className="self-start border border-[#D4C5BE] text-xs text-[#5A3A44] px-4 h-8 hover:border-[#8B1535] transition-colors disabled:opacity-50">
        {uploading ? 'Uploading…' : value ? 'Change' : 'Upload'}
      </button>
      {uploadMsg && <span className="text-xs text-[#8B1535]">{uploadMsg}</span>}
    </div>
  )
}

export function useSave(sectionKey: string) {
  const supabase = createClient()
  const router   = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')

  async function save(data: unknown) {
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert({ key: sectionKey, value: JSON.stringify(data) }, { onConflict: 'key' })
    if (error) { setMsg(error.message); setSaving(false); return }
    await fetch('/api/revalidate', { method: 'POST' }).catch(() => null)
    setMsg('Saved!')
    setTimeout(() => setMsg(''), 3000)
    router.refresh()
    setSaving(false)
  }

  return { save, saving, msg }
}
