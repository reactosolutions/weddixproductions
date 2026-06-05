import type { ServicesPageContent } from '@/lib/db/sections'

export default function ServicesHero({ content }: { content: ServicesPageContent }) {
  return (
    <section className="bg-white px-5 sm:px-6 lg:px-12 pt-16 sm:pt-20 pb-16 sm:pb-20 border-b border-[#E8E0DC]">
      <div className="max-w-7xl mx-auto">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-5">
          Our Services
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#8B1535] leading-[1.0]">
              {content.heading}
            </h1>
            <p className="mt-8 text-sm sm:text-base text-[#7A5560] leading-8 max-w-lg">
              {content.description}
            </p>
          </div>
          <div className="flex flex-col justify-end items-start lg:items-end gap-3 lg:pb-2">
            <div className="flex items-center gap-6">
              <span className="hidden lg:block w-px h-16 bg-[#E8E0DC]" />
              <div className="flex flex-col gap-2 lg:text-right">
                <span className="text-[10px] tracking-[0.22em] uppercase text-[#A8768A]">Available Worldwide</span>
                <p className="font-serif text-2xl sm:text-3xl font-light italic text-[#C4949F]">{content.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
