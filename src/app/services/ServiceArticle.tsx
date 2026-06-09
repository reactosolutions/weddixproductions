import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

interface Feature {
  icon: ReactNode
  text: string
}

interface ServiceArticleProps {
  id: string
  badge: string
  title: string
  description: string
  features: Feature[]
  cta: { label: string; href: string }
  photoLabel: string
  imageUrl?: string
  photoRight?: boolean
  titleWine?: boolean
  bg?: string
}

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#D4C5BE]">
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="opacity-30">
        <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
        <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
        <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
        <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
      </svg>
      <span className="text-[10px] tracking-widest uppercase text-[#8B1535] opacity-40 text-center px-6">
        {label}
      </span>
    </div>
  )
}

export default function ServiceArticle({
  id,
  badge,
  title,
  description,
  features,
  cta,
  photoLabel,
  imageUrl,
  photoRight = false,
  titleWine = false,
  bg = 'bg-white',
}: ServiceArticleProps) {
  // On mobile: always text → photo. On md+: honour photoRight for alternating layout.
  const photoOrder = photoRight ? 'order-2 md:order-2' : 'order-2 md:order-1'
  const textOrder  = photoRight ? 'order-1 md:order-1' : 'order-1 md:order-2'

  return (
    <article id={id} className={bg}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">

          {/* Text panel */}
          <div className={`flex flex-col justify-center px-0 md:px-10 lg:px-16 py-10 md:py-0 ${textOrder}`}>
            <span className="inline-flex self-start items-center px-3 py-1 mb-6 text-[10px] font-semibold tracking-[0.16em] uppercase bg-[#8B1535] text-[#F0E6E8]">
              {badge}
            </span>
            <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-5 ${titleWine ? 'text-[#8B1535]' : 'text-[#2A1018]'}`}>
              {title}
            </h2>
            <p className="text-sm text-[#7A5560] leading-7 mb-8 max-w-md">
              {description}
            </p>
            <ul className="flex flex-col gap-4 mb-10">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="shrink-0 mt-0.5 text-[#8B1535]">{f.icon}</span>
                  <span className="text-sm text-[#5A3A44] leading-6">{f.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href={cta.href}
              className="inline-flex items-center gap-3 self-start bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-7 h-11 hover:bg-[#6E1028] transition-colors"
            >
              {cta.label}
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M0 5h12M8 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Photo panel */}
          <div className={`relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-auto md:min-h-[460px] overflow-hidden ${photoOrder}`}>
            {imageUrl
              ? <Image src={imageUrl} alt={photoLabel} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
              : <PhotoPlaceholder label={photoLabel} />
            }
          </div>

        </div>
      </div>
    </article>
  )
}
