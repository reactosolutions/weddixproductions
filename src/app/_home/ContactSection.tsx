'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'home' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '' })
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const busy = status === 'loading'

  return (
    <section className="bg-white py-20 sm:py-28 px-5 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">

        {/* Form side */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-6">
            Inquire
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2A1018] leading-[1.15] mb-10">
            Let&apos;s create something{' '}
            <em className="italic text-[#8B1535]">timeless</em>{' '}
            together.
          </h2>

          {status === 'success' ? (
            <div className="flex flex-col gap-4">
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
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-[0.18em] uppercase text-[#A8768A]" htmlFor="hs-name">
                  Your Name
                </label>
                <input
                  id="hs-name"
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  disabled={busy}
                  className="w-full border-0 border-b border-[#D4C5BE] bg-transparent py-3 text-sm text-[#2A1018] placeholder:text-[#C4B4B8] focus:outline-none focus:border-[#8B1535] transition-colors disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-[0.18em] uppercase text-[#A8768A]" htmlFor="hs-email">
                  Email Address
                </label>
                <input
                  id="hs-email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  disabled={busy}
                  className="w-full border-0 border-b border-[#D4C5BE] bg-transparent py-3 text-sm text-[#2A1018] placeholder:text-[#C4B4B8] focus:outline-none focus:border-[#8B1535] transition-colors disabled:opacity-50"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-2 inline-flex items-center justify-center bg-[#8B1535] text-white text-xs font-semibold tracking-[0.18em] uppercase h-12 hover:bg-[#6E1028] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>

        {/* Photo side */}
        <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[480px] bg-[#D4C5BE] overflow-hidden order-first md:order-last">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="opacity-30">
              <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
              <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
              <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
              <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
            </svg>
            <span className="text-[10px] tracking-widest uppercase text-[#8B1535] opacity-40">Stationery Photo</span>
          </div>
        </div>

      </div>
    </section>
  )
}
