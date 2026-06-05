import type { Metadata } from 'next'
import AdminSidebar from './AdminSidebar'

export const metadata: Metadata = { title: 'Admin — Weddiex' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F5] flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 pt-[70px] sm:p-6 sm:pt-[70px] md:p-10 md:pt-10">{children}</main>
    </div>
  )
}
