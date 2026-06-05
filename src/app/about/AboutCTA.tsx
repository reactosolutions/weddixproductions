import Link from 'next/link'

interface Props { heading: string; subtext: string; buttonLabel: string }

export default function AboutCTA({ heading, subtext, buttonLabel }: Props) {
  return (
    <section className="bg-[#FFF0F2] px-5 sm:px-6 lg:px-12 py-20 sm:py-28">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#A8768A]">Let&apos;s Work Together</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2A1018] leading-tight">{heading}</h2>
        <p className="text-sm text-[#7A5560] leading-7 max-w-md">{subtext}</p>
        <Link href="/contact" className="inline-flex items-center gap-3 bg-[#8B1535] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 h-12 hover:bg-[#6E1028] transition-colors mt-2">
          {buttonLabel}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M0 5h12M8 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
