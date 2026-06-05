'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { GalleryItem } from '@/types/database'

const tabs = ['All', 'Weddings', 'Graduations', 'Portraits', 'Family', 'Events', 'Lifestyle']

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

function MediaCell({ item }: { item: GalleryItem }) {
  const isVideo = item.media_type === 'video'
  const ytId    = isVideo && item.image_url ? getYouTubeId(item.image_url) : null
  const thumb   = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : item.image_url

  const inner = (
    <div className={`relative ${item.aspect} overflow-hidden group cursor-pointer`}>
      {thumb ? (
        <Image
          src={thumb}
          alt={item.label}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#D4C5BE]">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" className="opacity-30">
            <rect x="2" y="8" width="36" height="26" rx="3" stroke="#8B1535" strokeWidth="1.5" />
            <circle cx="20" cy="21" r="7" stroke="#8B1535" strokeWidth="1.5" />
            <circle cx="20" cy="21" r="3" fill="#8B1535" fillOpacity="0.4" />
            <rect x="14" y="4" width="12" height="6" rx="2" stroke="#8B1535" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px] tracking-widest uppercase text-[#8B1535] opacity-40 text-center px-4">{item.label}</span>
        </div>
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#2A1018]/0 group-hover:bg-[#2A1018]/20 transition-colors duration-300" />
      {/* Video play icon */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/40 group-hover:bg-black/60 border border-white/50 flex items-center justify-center transition-colors duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      )}
    </div>
  )

  if (isVideo && item.image_url && !thumb) {
    return (
      <div className={`break-inside-avoid mb-4 ${item.aspect} overflow-hidden`}>
        <video src={item.image_url} controls playsInline preload="metadata" className="w-full h-full object-cover" />
      </div>
    )
  }

  if (isVideo && item.image_url) {
    return (
      <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="break-inside-avoid mb-4 block">
        {inner}
      </a>
    )
  }

  return <div className="break-inside-avoid mb-4">{inner}</div>
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState('All')
  const visible = items.filter((p) => active === 'All' || p.category === active)

  return (
    <section>

      {/* Mobile: wrapping pills — Desktop: underline tab row */}
      <div className="mb-10 sm:mb-14">
        <div className="flex flex-wrap gap-2 md:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 text-xs font-medium tracking-wide rounded-full border transition-colors ${
                active === tab
                  ? 'bg-[#8B1535] border-[#8B1535] text-white'
                  : 'bg-white border-[#D4C5BE] text-[#8B1535] hover:border-[#8B1535]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center border-b border-[#E8E0DC]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`shrink-0 px-5 py-3 text-xs tracking-wide transition-colors border-b-2 -mb-px ${
                active === tab
                  ? 'border-[#8B1535] text-[#8B1535] font-semibold'
                  : 'border-transparent text-[#A8768A] hover:text-[#8B1535]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {visible.map((item) => <MediaCell key={item.id} item={item} />)}
      </div>

      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="font-serif text-2xl font-light text-[#C4949F]">No items yet</p>
          <p className="text-sm text-[#A8768A]">Check back soon.</p>
        </div>
      )}

    </section>
  )
}
