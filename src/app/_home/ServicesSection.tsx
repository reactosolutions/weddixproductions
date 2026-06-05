import Link from 'next/link'
import { getHomeServices } from '@/lib/db/sections'

// Static icons per service slot (order matches DB services array)
const icons = [
  <svg key="w" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#8B1535" strokeWidth="1.4">
    <path d="M18 6 C18 6 8 10 8 20 C8 26 13 30 18 30 C23 30 28 26 28 20 C28 10 18 6 18 6Z" />
    <path d="M12 15 L15 18 L21 12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 2 L18 6" strokeLinecap="round" /><path d="M10 4 L12 7" strokeLinecap="round" /><path d="M26 4 L24 7" strokeLinecap="round" />
  </svg>,
  <svg key="g" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#8B1535" strokeWidth="1.4">
    <polygon points="18,8 32,15 18,22 4,15" strokeLinejoin="round" />
    <path d="M10 18 L10 27 Q18 31 26 27 L26 18" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 15 L32 23" strokeLinecap="round" /><circle cx="32" cy="24" r="1.5" fill="#8B1535" />
  </svg>,
  <svg key="p" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#8B1535" strokeWidth="1.4">
    <circle cx="18" cy="10" r="4" /><path d="M10 30 C10 22 26 22 26 30" strokeLinecap="round" />
    <circle cx="9" cy="14" r="3" /><path d="M3 30 C3 24 15 23 15 28" strokeLinecap="round" />
    <circle cx="27" cy="14" r="3" /><path d="M33 30 C33 24 21 23 21 28" strokeLinecap="round" />
  </svg>,
  <svg key="e" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#8B1535" strokeWidth="1.4">
    <rect x="5" y="14" width="26" height="18" rx="2" />
    <path d="M13 14 L13 10 Q13 6 18 6 Q23 6 23 10 L23 14" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="5" y1="22" x2="31" y2="22" /><line x1="15" y1="19" x2="21" y2="19" strokeLinecap="round" />
  </svg>,
]

const slugs = ['weddings', 'graduations', 'portraits', 'events']

export default async function ServicesSection() {
  const content = await getHomeServices()

  return (
    <section className="bg-[#FFF0F2] py-20 sm:py-28 px-5 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14 sm:mb-20">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-4">
            {content.eyebrow}
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#2A1018]">
            {content.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {content.services.map((s, i) => (
            <div key={i} className="flex flex-col gap-5 bg-white border border-[#EEE0E3] p-8 hover:shadow-md transition-shadow">
              <div>{icons[i]}</div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#8B1535] leading-snug">{s.title}</h3>
              <p className="text-sm text-[#7A5560] leading-7 flex-1">{s.desc}</p>
              <Link
                href={`/services#${slugs[i] ?? ''}`}
                className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8B1535] border-b border-[#8B1535] pb-0.5 w-fit hover:opacity-70 transition-opacity"
              >
                {s.cta_label}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
