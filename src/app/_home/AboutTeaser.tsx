import Link from 'next/link'
import Image from 'next/image'
import { getHomeAboutTeaser } from '@/lib/db/sections'

export default async function AboutTeaser() {
  const c = await getHomeAboutTeaser()
  const pillars = [
    { num: '01', title: c.pillar1_title, desc: c.pillar1_desc },
    { num: '02', title: c.pillar2_title, desc: c.pillar2_desc },
  ]

  return (
    <section className="bg-white py-20 sm:py-28 px-5 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">

        {/* Photo */}
        <div className="relative w-full aspect-[3/4] md:aspect-auto md:min-h-[600px] bg-[#D4C5BE] overflow-hidden">
          {c.image_url ? (
            <Image src={c.image_url} alt={c.pillar1_title} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="opacity-30">
                <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
                <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
                <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
                <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
              </svg>
              <span className="text-[10px] tracking-widest uppercase text-[#8B1535] opacity-40">Photographer Photo</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center px-0 md:px-14 lg:px-20 pt-12 md:pt-0">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-6">
            {c.eyebrow}
          </p>
          <blockquote className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-[#2A1018] leading-[1.2] mb-10">
            {c.quote_main}{' '}
            <em className="italic text-[#8B1535]">{c.quote_accent}</em>
          </blockquote>

          <ul className="flex flex-col gap-7 mb-12">
            {pillars.map(({ num, title, desc }) => (
              <li key={num} className="flex gap-6">
                <span className="font-serif text-xs text-[#C4949F] pt-0.5 shrink-0">{num}</span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#8B1535] mb-1.5">{title}</p>
                  <p className="text-sm text-[#7A5560] leading-7">{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="inline-flex items-center justify-center self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-12 hover:bg-[#6E1028] transition-colors"
          >
            {c.cta_label}
          </Link>
        </div>

      </div>
    </section>
  )
}
