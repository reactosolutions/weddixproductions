import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedGalleryItems } from '@/lib/db/gallery'
import type { GalleryItem } from '@/types/database'

function PhotoCell({ item }: { item: GalleryItem }) {
  return (
    <div className="relative aspect-square overflow-hidden group cursor-pointer bg-[#D4C5BE]">
      {item.image_url ? (
        <Image
          src={item.image_url}
          alt={item.label}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="opacity-30">
            <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
            <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
            <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
            <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px] tracking-widest uppercase text-[#8B1535] opacity-40">{item.label}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-[#2A1018]/0 group-hover:bg-[#2A1018]/20 transition-colors duration-300" />
    </div>
  )
}

export default async function GallerySection() {
  const items = await getFeaturedGalleryItems()

  return (
    <section className="bg-white py-20 sm:py-28 px-5 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-3">
              Portfolio
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2A1018] leading-tight">
              A Collection of<br />Stories
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item) => (
            <PhotoCell key={item.id} item={item} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 sm:mt-14 text-center">
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
