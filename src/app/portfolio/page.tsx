import type { Metadata } from 'next'
import { getAllGalleryItems } from '@/lib/db/gallery'
import GalleryGrid from './GalleryGrid'

export const metadata: Metadata = {
  title: 'Portfolio — Weddiex',
  description: 'Browse our portfolio of fine art wedding and editorial photography.',
}

export default async function Page() {
  const items = await getAllGalleryItems()
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pt-16 sm:pt-20 pb-24 sm:pb-32">

        <div className="mb-10 sm:mb-14">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-3">
            Our Portfolio
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#2A1018]">
            Our Work
          </h1>
        </div>

        <GalleryGrid items={items} />

      </div>
    </div>
  )
}
