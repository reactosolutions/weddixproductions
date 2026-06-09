import type { Metadata } from 'next'
import { getServicesPage } from '@/lib/db/sections'
import ServicesHero from './ServicesHero'
import ServiceArticle from './ServiceArticle'

export const metadata: Metadata = {
  title: 'Services — Weddiex',
  description: 'Fine art wedding, graduation, portrait, events, and editorial photography services.',
}

const IconClock      = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
const IconBook       = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
const IconDownload   = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
const IconPin        = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
const IconStar       = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconZap        = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
const IconHome       = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IconPalette    = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0010 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
const IconFrame      = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><rect x="7" y="7" width="10" height="10" rx="1" /></svg>
const IconBuilding   = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" /><path d="M16 22V11H8v11" /><path d="M22 7l-10-5L2 7" /></svg>
const IconBriefcase  = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
const IconTimer      = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const IconLightbulb  = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14" /></svg>
const IconFile       = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>

const ICONS = [
  [IconClock,     IconBook,      IconDownload],
  [IconPin,       IconStar,      IconZap],
  [IconHome,      IconPalette,   IconFrame],
  [IconBuilding,  IconBriefcase, IconTimer],
  [IconLightbulb, IconStar,      IconFile],
]

const CONFIG = [
  { id: 'weddings',    photoRight: false, titleWine: false, bg: 'bg-white'      },
  { id: 'graduations', photoRight: true,  titleWine: true,  bg: 'bg-[#FFF8F7]'  },
  { id: 'portraits',   photoRight: false, titleWine: false, bg: 'bg-white'      },
  { id: 'events',      photoRight: true,  titleWine: true,  bg: 'bg-[#FFF8F7]'  },
  { id: 'lifestyle',   photoRight: false, titleWine: false, bg: 'bg-white'      },
]

export default async function Page() {
  const content = await getServicesPage()
  return (
    <>
      <ServicesHero content={content} />
      {content.services.map((s, i) => (
        <ServiceArticle
          key={CONFIG[i]?.id ?? i}
          id={CONFIG[i]?.id ?? String(i)}
          badge={s.badge}
          title={s.title}
          description={s.desc}
          features={[
            { icon: ICONS[i]?.[0], text: s.feature1 },
            { icon: ICONS[i]?.[1], text: s.feature2 },
            { icon: ICONS[i]?.[2], text: s.feature3 },
          ]}
          cta={{ label: s.cta_label, href: '/contact' }}
          photoLabel={s.title}
          imageUrl={s.image_url || undefined}
          photoRight={CONFIG[i]?.photoRight ?? false}
          titleWine={CONFIG[i]?.titleWine ?? false}
          bg={CONFIG[i]?.bg ?? 'bg-white'}
        />
      ))}
    </>
  )
}
