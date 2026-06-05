import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const [{ count: galleryCount }, { count: testimonialCount }] = await Promise.all([
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Gallery Items',  value: galleryCount ?? 0 },
    { label: 'Testimonials',   value: testimonialCount ?? 0 },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#E8E0DC] p-6">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#A8768A] mb-2">{label}</p>
            <p className="font-serif text-4xl font-light text-[#8B1535]">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8E0DC] p-6">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#A8768A] mb-3">Quick Links</p>
        <ul className="flex flex-col gap-2 text-sm text-[#8B1535]">
          <li><a href="/admin/gallery" className="hover:underline">→ Manage Gallery</a></li>
          <li><a href="/admin/testimonials" className="hover:underline">→ Manage Testimonials</a></li>
          <li><a href="/" target="_blank" className="hover:underline">→ View Live Site</a></li>
        </ul>
      </div>
    </div>
  )
}
