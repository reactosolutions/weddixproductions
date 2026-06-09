import Link from 'next/link'
import { getFeaturedGalleryItems } from '@/lib/db/gallery'
import GallerySlider from './GallerySlider'

export default async function GallerySection() {
  const items = await getFeaturedGalleryItems()

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-3">
              Portfolio
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2A1018] leading-tight">
              A Collection of<br />Stories
            </h2>
          </div>
        </div>
      </div>

      {/* Full-width slider */}
      <GallerySlider items={items} />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase text-[#8B1535] border-b border-[#8B1535] pb-0.5 hover:opacity-70 transition-opacity"
          >
            View Full Portfolio
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M0 5h14M10 1l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
