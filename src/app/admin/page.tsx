import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSocialLinks } from '@/lib/db/sections'

const sections = [
  { href: '/admin/hero',          label: 'Hero Section',      desc: 'Headline, stats, CTA buttons' },
  { href: '/admin/home-services', label: 'Home Services',     desc: 'Service cards on homepage' },
  { href: '/admin/about-teaser',  label: 'Home Philosophy',   desc: 'Quote & pillars block' },
  { href: '/admin/services-page', label: 'Services Page',     desc: 'Full services articles' },
  { href: '/admin/about-page',    label: 'About Page',        desc: 'Story, values, CTA' },
  { href: '/admin/contact-page',  label: 'Contact Page',      desc: 'Heading, details, photo' },
  { href: '/admin/gallery',       label: 'Gallery',           desc: 'Upload & manage photos' },
  { href: '/admin/testimonials',  label: 'Testimonials',      desc: 'Client reviews' },
  { href: '/admin/social',        label: 'Social Links',      desc: 'Instagram, TikTok, etc.' },
]

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: galleryCount },
    { count: testimonialCount },
    { count: submissionCount },
    { data: recentSubmissions },
    social,
  ] = await Promise.all([
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('name, email, service, source, created_at').order('created_at', { ascending: false }).limit(5),
    getSocialLinks(),
  ])

  const activeSocials = Object.values(social).filter(Boolean).length

  const stats = [
    { label: 'Gallery Items',   value: galleryCount ?? 0,   href: '/admin/gallery' },
    { label: 'Testimonials',    value: testimonialCount ?? 0, href: '/admin/testimonials' },
    { label: 'Inquiries',       value: submissionCount ?? 0,  href: null },
    { label: 'Social Active',   value: activeSocials,          href: '/admin/social' },
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-light text-[#2A1018]">Dashboard</h1>
          <p className="text-xs text-[#A8768A] mt-1 tracking-wide">Welcome back — here&apos;s your site overview.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#D4C5BE] text-xs text-[#5A3A44] px-4 h-9 hover:border-[#8B1535] hover:text-[#8B1535] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View Live Site
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, href }) => {
          const inner = (
            <>
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#A8768A] mb-2">{label}</p>
              <p className="font-serif text-4xl font-light text-[#8B1535]">{value}</p>
            </>
          )
          return href ? (
            <Link key={label} href={href} className="bg-white border border-[#E8E0DC] p-6 hover:border-[#8B1535] transition-colors">
              {inner}
            </Link>
          ) : (
            <div key={label} className="bg-white border border-[#E8E0DC] p-6">{inner}</div>
          )
        })}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white border border-[#E8E0DC]">
        <div className="px-6 py-4 border-b border-[#E8E0DC] flex items-center justify-between">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#A8768A]">Recent Inquiries</p>
        </div>
        {recentSubmissions && recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0E8E4]">
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold">Name</th>
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold hidden sm:table-cell">Email</th>
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold hidden md:table-cell">Service</th>
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold hidden lg:table-cell">Source</th>
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#A8768A] font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((s, i) => (
                  <tr key={i} className="border-b border-[#F8F3F1] last:border-0 hover:bg-[#FAF7F5] transition-colors">
                    <td className="px-6 py-3.5 text-[#2A1018] font-medium">{s.name}</td>
                    <td className="px-6 py-3.5 text-[#7A5560] hidden sm:table-cell">{s.email}</td>
                    <td className="px-6 py-3.5 text-[#7A5560] hidden md:table-cell">{s.service || <span className="text-[#C4B4B8]">—</span>}</td>
                    <td className="px-6 py-3.5 hidden lg:table-cell">
                      <span className="text-[10px] tracking-wide uppercase text-[#A8768A] bg-[#FAF7F5] border border-[#E8E0DC] px-2 py-0.5">{s.source}</span>
                    </td>
                    <td className="px-6 py-3.5 text-[#A8768A] text-xs">{fmt(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-[#C4B4B8]">
            No inquiries yet — they will appear here when visitors submit the contact form.
          </div>
        )}
      </div>

      {/* Section shortcuts */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#A8768A] mb-4">Manage Content</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-[#E8E0DC] px-5 py-4 flex items-center justify-between gap-4 hover:border-[#8B1535] transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-[#2A1018] group-hover:text-[#8B1535] transition-colors">{label}</p>
                <p className="text-xs text-[#A8768A] mt-0.5">{desc}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#D4C5BE] group-hover:text-[#8B1535] transition-colors">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
