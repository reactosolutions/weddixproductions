'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { GalleryItem } from '@/types/database'

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

function getThumb(item: GalleryItem): string | null {
  if (!item.image_url) return null
  if (item.media_type === 'video') {
    const ytId = getYouTubeId(item.image_url)
    return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
  }
  return item.image_url
}

export default function GallerySlider({ items }: { items: GalleryItem[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)

  const next = useCallback(() => setCurrent((i) => (i + 1) % items.length), [items.length])
  const prev = () => setCurrent((i) => (i - 1 + items.length) % items.length)

  useEffect(() => {
    if (paused || items.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next, items.length])

  if (!items.length) return null

  const item = items[current]
  const isVideo = item.media_type === 'video'

  return (
    <div
      className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-[#2A1018]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {items.map((it, i) => {
        const thumb = getThumb(it)
        return (
          <div
            key={it.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            {thumb ? (
              <Image src={thumb} alt={it.label} fill className="object-cover" sizes="100vw" priority={i === 0} />
            ) : (
              <div className="absolute inset-0 bg-[#2A1018]" />
            )}
          </div>
        )
      })}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Video play badge */}
      {isVideo && item.image_url && (
        <a
          href={item.image_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center group"
          aria-label="Watch video"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 group-hover:bg-white/40 border border-white/50 flex items-center justify-center transition-colors duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </a>
      )}

      {/* Caption */}
      <div className="absolute bottom-12 sm:bottom-8 left-6 sm:left-10 pointer-events-none">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-1">{item.category}</p>
        <p className="font-serif text-xl sm:text-2xl font-light text-white">{item.label}</p>
      </div>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 border border-white/20 text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 border border-white/20 text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
