'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/browser'
import type { GalleryItem } from '@/types/database'

const CATEGORIES = ['Weddings', 'Graduations', 'Portraits', 'Family', 'Events', 'Lifestyle']
const ASPECTS    = ['aspect-[2/3]', 'aspect-[3/2]', 'aspect-square', 'aspect-[3/4]']
const empty = { category: 'Weddings', label: '', aspect: 'aspect-[2/3]', featured: false, display_order: 0, image_url: '' }

export default function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const router      = useRouter()
  const supabase    = createClient()
  const fileRef     = useRef<HTMLInputElement>(null)

  const [items, setItems]       = useState(initialItems)
  const [form, setForm]         = useState(empty)
  const [editing, setEditing]   = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg]           = useState('')

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = k === 'featured' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm((f) => ({ ...f, [k]: value } as typeof empty))
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
    const payload = { ...form, display_order: Number(form.display_order), image_url: form.image_url || null }

    if (editing) {
      const { error } = await supabase.from('gallery_items').update(payload).eq('id', editing)
      if (!error) { flash('Saved'); setEditing(null); setForm(empty); router.refresh() }
      else flash(error.message)
    } else {
      const { error } = await supabase.from('gallery_items').insert(payload)
      if (!error) { flash('Added'); setForm(empty); router.refresh() }
      else flash(error.message)
    }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this item?')) return
    await supabase.from('gallery_items').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    flash('Deleted')
  }

  function startEdit(item: GalleryItem) {
    setEditing(item.id)
    setForm({
      category: item.category, label: item.label, aspect: item.aspect,
      featured: item.featured, display_order: item.display_order,
      image_url: item.image_url ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputCls = 'border border-[#D4C5BE] bg-white px-3 py-2 text-sm text-[#2A1018] focus:outline-none focus:border-[#8B1535] transition-colors w-full'

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
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Label / Alt Text</label>
              <input type="text" value={form.label} onChange={set('label')} placeholder="Wedding couple portrait" className={inputCls} />
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
              <input type="number" value={form.display_order} onChange={set('display_order')} className={inputCls} />
            </div>
            <div className="flex items-end pb-1 gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={set('featured') as never} className="accent-[#8B1535] w-4 h-4" />
              <label htmlFor="featured" className="text-sm text-[#5A3A44]">Featured on home page</label>
            </div>
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-3 min-w-[160px]">
            <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A]">Photo</label>

            {/* Preview */}
            <div className="relative w-full aspect-square bg-[#D4C5BE] overflow-hidden border border-[#E8E0DC]" style={{ width: 160 }}>
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
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {msg && <p className="text-xs text-[#8B1535] mt-4">{msg}</p>}

        <div className="flex gap-3 mt-5">
          <button
            onClick={save}
            disabled={saving || !form.label}
            className="bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-6 h-9 hover:bg-[#6E1028] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button
              onClick={() => { setEditing(null); setForm(empty) }}
              className="border border-[#D4C5BE] text-sm text-[#5A3A44] px-4 h-9 hover:border-[#8B1535] transition-colors"
            >
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
              {['Photo', 'Label', 'Category', 'Aspect', 'Featured', 'Order', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#A8768A]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#F0E8E4] hover:bg-[#FAF7F5]">
                <td className="px-4 py-2">
                  <div className="relative w-12 h-12 bg-[#D4C5BE] overflow-hidden shrink-0">
                    {item.image_url
                      ? <Image src={item.image_url} alt={item.label} fill className="object-cover" sizes="48px" />
                      : <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B1535" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                    }
                  </div>
                </td>
                <td className="px-4 py-3 text-[#2A1018]">{item.label}</td>
                <td className="px-4 py-3 text-[#5A3A44]">{item.category}</td>
                <td className="px-4 py-3 text-[#A8768A] font-mono text-xs">{item.aspect}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block w-2 h-2 rounded-full ${item.featured ? 'bg-[#8B1535]' : 'bg-[#D4C5BE]'}`} />
                </td>
                <td className="px-4 py-3 text-[#A8768A]">{item.display_order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(item)} className="text-xs text-[#8B1535] hover:underline">Edit</button>
                    <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-[#A8768A]">No items yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
