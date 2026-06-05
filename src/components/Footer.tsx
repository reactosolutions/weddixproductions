import Link from 'next/link'
import Image from 'next/image'
import logoVerticalWhite from '@/images/logo/WEDDIX Logo-02.png'
import { getSocialLinks } from '@/lib/db/sections'
import type { SocialLinksContent } from '@/lib/db/sections'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
]

const socialIcons: { key: keyof SocialLinksContent; label: string; path: string }[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    path: 'M9 12a4 4 0 104 4V4a5 5 0 005 5',
  },
  {
    key: 'pinterest',
    label: 'Pinterest',
    path: 'M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.55c0-1.45.84-2.54 1.88-2.54.89 0 1.32.67 1.32 1.47 0 .89-.57 2.23-.87 3.47-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.1-2.38 3.1-5.2 0-2.14-1.44-3.75-4.04-3.75-2.94 0-4.77 2.2-4.77 4.65 0 .84.24 1.43.62 1.89.17.21.19.29.13.53l-.18.74c-.06.24-.24.33-.44.24-1.24-.51-1.82-1.87-1.82-3.4 0-2.52 2.12-5.56 6.33-5.56 3.39 0 5.61 2.46 5.61 5.11 0 3.51-1.94 6.12-4.8 6.12-.96 0-1.87-.52-2.18-1.1l-.59 2.26c-.21.81-.78 1.82-1.17 2.44C10.89 21.86 11.43 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
]

export default async function Footer() {
  const social = await getSocialLinks()
  const activeSocials = socialIcons.filter(({ key }) => !!social[key])

  return (
    <footer className="bg-[#8B1535] text-[#D9B8BF]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pt-14 sm:pt-20 pb-8 sm:pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14 mb-12 sm:mb-16">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Image src={logoVerticalWhite} alt="Weddix Wedding Productions" className="w-28 h-auto" />
            <p className="text-sm leading-7 text-[#C4949F] max-w-sm">
              Weddiex is a premier photography house dedicated to luxury weddings and editorial portraits.
            </p>
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-4">
                {activeSocials.map(({ key, label, path }) => (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[#C4949F] hover:text-[#F0E6E8] transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation column */}
          <div className="flex flex-col gap-4 sm:gap-5 sm:pl-16">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C4949F]">
              Navigation
            </span>
            <ul className="flex flex-col gap-3 sm:gap-4">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm tracking-wide text-[#D9B8BF] hover:text-[#F0E6E8] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#A03050] pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-[#A8606D]">
            © 2026 Weddiex. Fine Art Wedding Photography.
          </p>
          <p className="text-xs tracking-[0.18em] uppercase text-[#A8606D]">
            Crafted with Intention
          </p>
        </div>

      </div>
    </footer>
  )
}
