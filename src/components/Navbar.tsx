'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <header className="w-full bg-[#FAF7F5] border-b border-[#E8E0DC] relative z-40">
        <nav className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 h-[64px] md:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl font-semibold text-[#8B1535] tracking-tight"
          >
            Weddiex
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-sm text-[#8B1535] transition-opacity hover:opacity-70 ${
                      active
                        ? 'font-semibold border-b border-[#8B1535] pb-0.5'
                        : 'font-normal'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-6 h-10 hover:bg-[#6E1028] transition-colors"
          >
            Inquire
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 text-[#8B1535]"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span
              className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${
                isOpen ? 'translate-y-[0.5px] rotate-45' : '-translate-y-[4px]'
              }`}
            />
            <span
              className={`block w-6 h-px bg-current transition-all duration-300 ${
                isOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${
                isOpen ? '-translate-y-[0.5px] -rotate-45' : 'translate-y-[4px]'
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed top-[64px] inset-x-0 z-30 bg-[#FAF7F5] border-b border-[#E8E0DC] transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col px-5 pt-4 pb-2">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center h-12 text-base text-[#8B1535] border-b border-[#EFE8E4] transition-opacity hover:opacity-70 ${
                    active ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="px-5 py-5">
          <Link
            href="/contact"
            className="flex items-center justify-center w-full bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase h-12 hover:bg-[#6E1028] transition-colors"
          >
            Inquire
          </Link>
        </div>
      </div>
    </>
  )
}
