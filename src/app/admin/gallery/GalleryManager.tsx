'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/browser'
import type { GalleryImage } from '@/types/database'

const CATEGORIES = ['Weddings', 'Graduations', 'Portraits', 'Family', 'Events', 'Lifestyle']
const ASPECTS    = ['aspect-[2/3]', 'aspect-[3/2]', 'aspect-square', 'aspect-[3/4]']

const empty = {
  category: 'Weddings', caption: '', aspect: 'aspect-[2/3]',
  featured: false, order_index: 0, image_url: '', media_type: 'image' as 'image' | 'video',
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

function VideoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-40">
      <rect x="2" y="4" width="15" height="16" rx="2" stroke="#8B1535" strokeWidth="1.5" />
      <path d="M17 9l5-3v12l-5-3V9z" stroke="#8B1535" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export default function GalleryManager({ initialItems }: { initialItems: GalleryImage[] }) {
  const router      = useRouter()
  const supabase    = createClient()
  const fileRef     = useRef<HTMLInputElement>(null)
  const videoRef    = useRef<HTMLInputElement>(null)

  const [items, setItems]         = useState(initialItems)
  const [form, setForm]           = useState(empty)
  const [editing, setEditing]     = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg]             = useState('')

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = k === 'featured' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm((f) => ({ ...f, [k]: value } as typeof empty))
    }

  function setMediaType(t: 'image' | 'video') {
    setForm((f) => ({ ...f, media_type: t, image_url: '' }))
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: true })
    if (error) { flash(error.message); setUploading(false); return }
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
    flash('Video uploaded')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: true })
    if (error) { flash(error.message); setUploading(false); return }
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
    flash('Image uploaded')
  }

  async function save() {
    setSaving(true)
    const payload = {
      ...form,
      order_index: Number(form.order_index),
      image_url: form.image_url || null,
    }

    if (editing) {
      const { error } = await supabase.from('gallery_images').update(payload).eq('id', editing)
      if (!error) { flash('Saved'); setEditing(null); setForm(empty); router.refresh() }
      else flash(error.message)
    } else {
      const { error } = await supabase.from('gallery_images').insert(payload)
      if (!error) { flash('Added'); setForm(empty); router.refresh() }
      else flash(error.message)
    }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this item?')) return
    await supabase.from('gallery_images').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    flash('Deleted')
  }

  function startEdit(item: GalleryImage) {
    setEditing(item.id)
    setForm({
      category: item.category, caption: item.caption ?? '', aspect: item.aspect,
      featured: item.featured, order_index: item.order_index,
      image_url: item.image_url ?? '',
      media_type: item.media_type ?? 'image',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputCls = 'border border-[#D4C5BE] bg-white px-3 py-2 text-sm text-[#2A1018] focus:outline-none focus:border-[#8B1535] transition-colors w-full'

  const ytId = form.media_type === 'video' ? getYouTubeId(form.image_url) : null
  const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null

  return (
    <div className="flex flex-col gap-8">

      {/* ── Form ── */}
      <div className="bg-white border border-[#E8E0DC] p-6">
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">
          {editing ? 'Edit Item' : 'Add New Item'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Caption / Alt Text</label>
              <input type="text" value={form.caption} onChange={set('caption')} placeholder="Wedding couple portrait" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Category</label>
              <select value={form.category} onChange={set('category')} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Aspect Ratio</label>
              <select value={form.aspect} onChange={set('aspect')} className={inputCls}>
                {ASPECTS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Display Order</label>
              <input type="number" value={form.order_index} onChange={set('order_index')} className={inputCls} />
            </div>
            <div className="flex items-end pb-1 gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={set('featured') as never} className="accent-[#8B1535] w-4 h-4" />
              <label htmlFor="featured" className="text-sm text-[#5A3A44]">Featured on home page</label>
            </div>
          </div>

          {/* Media upload */}
          <div className="flex flex-col gap-3" style={{ minWidth: 160 }}>

            {/* Type toggle */}
            <div className="flex border border-[#D4C5BE] overflow-hidden">
              {(['image', 'video'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMediaType(t)}
                  className={`flex-1 text-xs py-1.5 font-medium tracking-wide transition-colors capitalize ${
                    form.media_type === t
                      ? 'bg-[#8B1535] text-white'
                      : 'bg-white text-[#5A3A44] hover:bg-[#FAF7F5]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {form.media_type === 'image' ? (
              <>
                <div className="relative bg-[#D4C5BE] border border-[#E8E0DC] overflow-hidden" style={{ width: 160, height: 160 }}>
                  {form.image_url ? (
                    <Image src={form.image_url} alt="preview" fill className="object-cover" sizes="160px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="opacity-30">
                        <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
                        <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
                        <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
                        <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="border border-[#D4C5BE] text-xs text-[#5A3A44] px-3 h-8 hover:border-[#8B1535] hover:text-[#8B1535] transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {uploading ? 'Uploading…' : form.image_url ? 'Change Photo' : 'Upload Photo'}
                </button>
                {form.image_url && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, image_url: '' }))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                )}
              </>
            ) : (
              <>
                <div className="relative bg-[#D4C5BE] border border-[#E8E0DC] overflow-hidden" style={{ width: 160, height: 160 }}>
                  {form.image_url ? (
                    <video src={form.image_url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><VideoIcon /></div>
                  )}
                  {form.image_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={videoRef} type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={handleVideoUpload} />
                <button
                  type="button"
                  onClick={() => videoRef.current?.click()}
                  disabled={uploading}
                  className="border border-[#D4C5BE] text-xs text-[#5A3A44] px-3 h-8 hover:border-[#8B1535] hover:text-[#8B1535] transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {uploading ? 'Uploading…' : form.image_url ? 'Change Video' : 'Upload Video'}
                </button>
                {form.image_url && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, image_url: '' }))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                )}
              </>
            )}
          </div>
        </div>

        {msg && <p className="text-xs text-[#8B1535] mt-4">{msg}</p>}

        <div className="flex gap-3 mt-5">
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-6 h-9 hover:bg-[#6E1028] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(empty) }} className="border border-[#D4C5BE] text-sm text-[#5A3A44] px-4 h-9 hover:border-[#8B1535] transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#E8E0DC] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E8E0DC] bg-[#FAF7F5]">
            <tr>
              {['Preview', 'Caption', 'Type', 'Category', 'Featured', 'Order', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#A8768A]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isVideo = item.media_type === 'video'
              const thumb = isVideo ? (getYouTubeId(item.image_url ?? '') ? `https://img.youtube.com/vi/${getYouTubeId(item.image_url ?? '')}/default.jpg` : null) : item.image_url
              return (
                <tr key={item.id} className="border-b border-[#F0E8E4] hover:bg-[#FAF7F5]">
                  <td className="px-4 py-2">
                    <div className="relative w-12 h-12 bg-[#D4C5BE] overflow-hidden shrink-0">
                      {thumb ? (
                        <Image src={thumb} alt={item.caption ?? ''} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-40">
                          {isVideo
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B1535" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B1535" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          }
                        </div>
                      )}
                      {isVideo && thumb && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#2A1018]">{item.caption}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 ${isVideo ? 'bg-[#FFF0F2] text-[#8B1535]' : 'bg-[#FAF7F5] text-[#A8768A]'}`}>
                      {item.media_type ?? 'image'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5A3A44]">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full ${item.featured ? 'bg-[#8B1535]' : 'bg-[#D4C5BE]'}`} />
                  </td>
                  <td className="px-4 py-3 text-[#A8768A]">{item.order_index}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(item)} className="text-xs text-[#8B1535] hover:underline">Edit</button>
                      <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-[#A8768A]">No items yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
