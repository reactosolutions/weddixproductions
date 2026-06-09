'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import type { Testimonial } from '@/types/database'

const empty = { content: '', client_name: '', client_title: '' }

export default function TestimonialsManager({ initialItems }: { initialItems: Testimonial[] }) {
  const router   = useRouter()
  const supabase = createClient()
  const [items, setItems]     = useState(initialItems)
  const [form, setForm]       = useState(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save() {
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('testimonials').update(form).eq('id', editing)
      if (!error) { flash('Saved'); setEditing(null); setForm(empty); router.refresh() }
      else flash(error.message)
    } else {
      const { error } = await supabase.from('testimonials').insert(form)
      if (!error) { flash('Added'); setForm(empty); router.refresh() }
      else flash(error.message)
    }
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    flash('Deleted')
  }

  function startEdit(item: Testimonial) {
    setEditing(item.id)
    setForm({ content: item.content, client_name: item.client_name, client_title: item.client_title ?? '' })
  }

  const inputCls = 'border border-[#D4C5BE] bg-white px-3 py-2 text-sm text-[#2A1018] focus:outline-none focus:border-[#8B1535] transition-colors w-full'

  return (
    <div className="flex flex-col gap-8">

      {/* Form */}
      <div className="bg-white border border-[#E8E0DC] p-6">
        <h2 className="text-sm font-semibold text-[#2A1018] mb-5">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>

        <div className="flex flex-col gap-4 mb-5">
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Quote</label>
            <textarea rows={3} value={form.content} onChange={set('content')} placeholder="Client's words…" className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Client Name</label>
              <input type="text" value={form.client_name} onChange={set('client_name')} placeholder="Eleanor & Markus" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Detail (e.g. Tuscany, 2023)</label>
              <input type="text" value={form.client_title} onChange={set('client_title')} placeholder="Tuscany, 2023" className={inputCls} />
            </div>
          </div>
        </div>

        {msg && <p className="text-xs text-[#8B1535] mb-3">{msg}</p>}

        <div className="flex gap-3">
          <button onClick={save} disabled={saving || !form.content || !form.client_name}
            className="bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-6 h-9 hover:bg-[#6E1028] transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(empty) }}
              className="border border-[#D4C5BE] text-sm text-[#5A3A44] px-4 h-9 hover:border-[#8B1535] transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E0DC] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E8E0DC] bg-[#FAF7F5]">
            <tr>
              {['Quote', 'Client', 'Detail', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#A8768A]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#F0E8E4] hover:bg-[#FAF7F5]">
                <td className="px-4 py-3 text-[#2A1018] max-w-xs truncate">{item.content}</td>
                <td className="px-4 py-3 text-[#5A3A44] whitespace-nowrap">{item.client_name}</td>
                <td className="px-4 py-3 text-[#A8768A] whitespace-nowrap">{item.client_title}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(item)} className="text-xs text-[#8B1535] hover:underline">Edit</button>
                    <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-[#A8768A]">No testimonials yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
