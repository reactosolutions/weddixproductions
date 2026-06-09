'use client'

import { useState } from 'react'

const services = ['Weddings', 'Graduations', 'Family & Portraits', 'Events & Corporate', 'Lifestyle & Editorial']

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const inputBase = 'w-full border-0 border-b border-[#D4C5BE] bg-transparent py-3 text-sm text-[#2A1018] placeholder:text-[#C4B4B8] focus:outline-none focus:border-[#8B1535] transition-colors disabled:opacity-50'
  const label = 'block text-[10px] tracking-[0.18em] uppercase text-[#A8768A] mb-1'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'contact_page' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', service: '', message: '' })
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-4 py-6">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#A8768A]">
          Message Sent
        </p>
        <p className="text-sm text-[#7A5560] leading-7">
          Thank you for reaching out. We&apos;ll be in touch with you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="self-start text-[10px] tracking-[0.18em] uppercase text-[#8B1535] underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    )
  }

  const busy = status === 'loading'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#A8768A]">
        Send a Message
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <div>
          <label className={label} htmlFor="name">Your Name</label>
          <input id="name" type="text" placeholder="Abeer Sawaan" value={form.name} onChange={set('name')} required disabled={busy} className={inputBase} />
        </div>
        <div>
          <label className={label} htmlFor="email">Email Address</label>
          <input id="email" type="email" placeholder="hello@example.com" value={form.email} onChange={set('email')} required disabled={busy} className={inputBase} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="service">Service of Interest</label>
        <select id="service" value={form.service} onChange={set('service')} disabled={busy} className={`${inputBase} cursor-pointer`}>
          <option value="" disabled>Select a service</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="message">Your Message</label>
        <textarea
          id="message"
          placeholder="Tell us about your special day..."
          rows={4}
          value={form.message}
          onChange={set('message')}
          disabled={busy}
          className={`${inputBase} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center bg-[#8B1535] text-white text-xs font-semibold tracking-[0.18em] uppercase h-12 hover:bg-[#6E1028] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  )
}
