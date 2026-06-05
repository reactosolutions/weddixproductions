import type { Metadata } from 'next'
import Image from 'next/image'
import { getContactPage } from '@/lib/db/sections'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Weddiex',
  description: 'Get in touch with Weddiex for fine art wedding and editorial photography inquiries.',
}

export default async function Page() {
  const c = await getContactPage()
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[90vh]">

          {/* Left — heading + photo */}
          <div className="flex flex-col pt-16 sm:pt-20 pb-16 sm:pb-24 lg:pr-14">
            <div className="mb-10">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#8B1535] leading-[1.1] mb-6">
                {c.heading}
              </h1>
              <p className="text-sm sm:text-base text-[#7A5560] leading-8 max-w-md">{c.subtext}</p>
            </div>

            {/* Photo */}
            <div className="relative flex-1 min-h-[380px] sm:min-h-[500px] bg-[#D4C5BE] overflow-hidden">
              {c.image_url ? (
                <Image src={c.image_url} alt="Contact" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="opacity-30">
                    <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
                    <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
                    <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
                    <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[10px] tracking-widest uppercase text-[#8B1535] opacity-40">Wedding Couple Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — contact info + form */}
          <div className="flex flex-col justify-center gap-12 pt-16 sm:pt-20 pb-16 sm:pb-24 lg:pl-14 border-l-0 lg:border-l border-[#E8E0DC]">
            <ContactInfo whatsapp={c.whatsapp} location={c.location} availability={c.availability} />
            <div className="border-t border-[#E8E0DC] pt-10">
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
