import Image from 'next/image'

interface Props { eyebrow: string; name: string; description: string; imageUrl: string }

export default function AboutHero({ eyebrow, name, description, imageUrl }: Props) {
  return (
    <section className="bg-white px-5 sm:px-6 lg:px-12 pt-16 sm:pt-20 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 items-end">

        <div className="pb-14 sm:pb-20">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#A8768A] mb-6">{eyebrow}</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-[#8B1535] leading-[1.0] mb-8">
            {name.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}
          </h1>
          <p className="text-sm sm:text-base text-[#7A5560] leading-8 max-w-md">{description}</p>
        </div>

        <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[580px] bg-[#D4C5BE] self-end overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="opacity-30">
                <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
                <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
                <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
                <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
              </svg>
              <span className="text-[10px] tracking-widest uppercase text-[#8B1535] opacity-40">Photographer Portrait</span>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
