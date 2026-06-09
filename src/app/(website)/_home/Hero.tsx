import Link from 'next/link'
import Image from 'next/image'
import { getHeroContent } from '@/lib/db/settings'

export default async function Hero() {
  const hero = await getHeroContent()

  return (
    <section className="relative min-h-[100svh] flex flex-col md:flex-row overflow-hidden">

      {/* Left — text panel */}
      <div className="relative z-10 flex flex-col justify-center bg-[#FAF7F5] px-8 sm:px-14 lg:px-24 py-24 md:py-20 w-full md:w-[55%] md:min-h-[100svh]">

        {/* Decorative rule */}
        <div className="flex items-center gap-4 mb-10">
          <span className="block w-10 h-px bg-[#8B1535]" />
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8B1535]">
            Fine Art Wedding Photography
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-light text-[#2A1018] leading-[1.1] mb-6">
          <span className="block text-[clamp(2.6rem,5vw,4.5rem)]">{hero.headline_line1}</span>
          <span className="block text-[clamp(2.6rem,5vw,4.5rem)]">{hero.headline_line2}</span>
          <span className="block text-[clamp(2.6rem,5vw,4.5rem)] italic text-[#8B1535]">{hero.headline_line3}</span>
        </h1>

        {/* Subtext */}
        <p className="text-[#7A5560] text-base sm:text-lg leading-8 max-w-md mb-10">
          {hero.subtext}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href={hero.cta_primary_href}
            className="inline-flex items-center justify-center bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-12 hover:bg-[#6E1028] transition-colors"
          >
            {hero.cta_primary_label}
          </Link>
          <Link
            href={hero.cta_secondary_href}
            className="inline-flex items-center justify-center border border-[#8B1535] text-[#8B1535] text-xs font-semibold tracking-[0.15em] uppercase px-8 h-12 hover:bg-[#8B1535] hover:text-white transition-colors"
          >
            {hero.cta_secondary_label}
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center flex-wrap gap-x-8 gap-y-4 border-t border-[#E8E0DC] pt-8">
          {[
            { value: hero.stat1_value, label: hero.stat1_label },
            { value: hero.stat2_value, label: hero.stat2_label },
            { value: hero.stat3_value, label: hero.stat3_label },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-serif text-2xl font-semibold text-[#8B1535]">{value}</span>
              <span className="text-[10px] tracking-[0.18em] uppercase text-[#A8768A]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — hero photo */}
      <div className="relative w-full md:w-[45%] h-[55vw] md:h-auto md:min-h-[100svh] overflow-hidden bg-[#D4C5BE]">
        {hero.image_url ? (
          <Image
            src={hero.image_url}
            alt="Hero"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-30">
              <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
              <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
              <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
              <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
            </svg>
            <span className="text-[11px] tracking-widest uppercase text-[#8B1535] opacity-40">Hero Photo</span>
          </div>
        )}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#FAF7F5] to-transparent hidden md:block pointer-events-none" />
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20">
        <span className="text-[9px] tracking-[0.2em] uppercase text-[#A8768A]">Scroll</span>
        <span className="block w-px h-8 bg-[#8B1535] opacity-40 animate-pulse" />
      </div>

    </section>
  )
}
