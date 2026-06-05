'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const inputBase = 'w-full border border-[#D4C5BE] bg-white px-4 py-3 text-sm text-[#2A1018] placeholder:text-[#C4B4B8] focus:outline-none focus:border-[#8B1535] transition-colors'

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-serif text-3xl font-semibold text-[#8B1535]">Weddiex</span>
          <p className="text-xs tracking-[0.18em] uppercase text-[#A8768A] mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E8E0DC] p-8 flex flex-col gap-5">
          <h1 className="font-serif text-xl font-light text-[#2A1018] mb-2">Sign In</h1>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.18em] uppercase text-[#A8768A]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.18em] uppercase text-[#A8768A]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBase}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  )
}
