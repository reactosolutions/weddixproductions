'use client'

import { useState, useEffect } from 'react'
import { cardCls } from '../_shared/SectionShell'

type User = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
}

function fmt(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function UsersManager({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers]     = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState('')
  const [createErr, setCreateErr] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    if (res.ok) setUsers(data.users)
    else setError(data.error)
    setLoading(false)
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateErr('')
    setCreateMsg('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) {
      setCreateMsg(`User ${email} created successfully.`)
      setEmail('')
      setPassword('')
      fetchUsers()
    } else {
      setCreateErr(data.error)
    }
    setCreating(false)
  }

  async function deleteUser(userId: string, userEmail: string) {
    if (!confirm(`Delete user ${userEmail}? This cannot be undone.`)) return
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const data = await res.json()
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== userId))
    else alert(data.error)
  }

  const inputCls = 'border border-[#D4C5BE] bg-white px-3 py-2 text-sm text-[#2A1018] focus:outline-none focus:border-[#8B1535] transition-colors w-full'

  return (
    <div className="flex flex-col gap-6">

      {/* Create user */}
      <div className={cardCls}>
        <h2 className="text-sm font-semibold text-[#2A1018] mb-1">Create New User</h2>
        <p className="text-xs text-[#A8768A] mb-5">New users can sign in to the admin panel immediately.</p>
        <form onSubmit={createUser} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@example.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#A8768A] mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters" className={inputCls} />
            </div>
          </div>
          {createErr && <p className="text-xs text-red-600">{createErr}</p>}
          {createMsg && <p className="text-xs text-[#8B1535]">{createMsg}</p>}
          <button
            type="submit"
            disabled={creating}
            className="self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-11 hover:bg-[#6E1028] transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create User'}
          </button>
        </form>
      </div>

      {/* Users list */}
      <div className="bg-white border border-[#E8E0DC]">
        <div className="px-6 py-4 border-b border-[#E8E0DC]">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#A8768A]">
            Admin Users {!loading && `(${users.length})`}
          </p>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-sm text-[#A8768A]">Loading…</div>
        ) : error ? (
          <div className="px-6 py-10 text-sm text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0E8E4]">
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold">Email</th>
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold hidden sm:table-cell">Created</th>
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold hidden md:table-cell">Last Sign In</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#F8F3F1] last:border-0 hover:bg-[#FAF7F5]">
                    <td className="px-6 py-3.5 text-[#2A1018] font-medium">
                      {u.email}
                      {u.id === currentUserId && (
                        <span className="ml-2 text-[10px] tracking-wide uppercase text-[#A8768A] bg-[#FAF7F5] border border-[#E8E0DC] px-2 py-0.5">You</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-[#A8768A] text-xs hidden sm:table-cell">{fmt(u.created_at)}</td>
                    <td className="px-6 py-3.5 text-[#A8768A] text-xs hidden md:table-cell">{fmt(u.last_sign_in_at)}</td>
                    <td className="px-6 py-3.5 text-right">
                      {u.id !== currentUserId && (
                        <button
                          onClick={() => deleteUser(u.id, u.email!)}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
