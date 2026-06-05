import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-[#8B1535] text-[#D9B8BF]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pt-14 sm:pt-20 pb-8 sm:pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14 mb-12 sm:mb-16">
          {/* Brand column */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#F0E6E8]">
              Weddiex
            </span>
            <p className="text-sm leading-7 text-[#C4949F] max-w-sm">
              Weddiex is a premier photography house dedicated to luxury weddings and editorial portraits.
            </p>
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
