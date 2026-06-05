import type { Metadata } from 'next'
import AdminSidebar from './AdminSidebar'

export const metadata: Metadata = { title: 'Admin — Weddiex' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F5] flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-6 sm:p-10">{children}</main>
    </div>
  )
}
