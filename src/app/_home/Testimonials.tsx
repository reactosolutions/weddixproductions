'use client'

import { useState } from 'react'
import type { Testimonial } from '@/types/database'

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  const total = testimonials.length

  if (total === 0) return null

  const visible = [testimonials[index], testimonials[(index + 1) % total]]

  return (
    <section className="bg-[#FFF0F2] py-20 sm:py-28 px-5 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#8B1535] mb-4">
            Kind Words
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2A1018]">
            Client Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-10">
          {visible.map((t, i) => (
            <div key={t.id ?? i} className="bg-white border border-[#EEE0E3] p-8 sm:p-10 flex flex-col gap-8">
              <blockquote className="font-serif text-lg sm:text-xl font-light text-[#2A1018] leading-8 italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#8B1535] flex items-center justify-center text-white text-xs font-semibold tracking-wider shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2A1018] tracking-wide">{t.client_name}</p>
                  <p className="text-xs text-[#A8768A] mt-0.5">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {total > 2 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              aria-label="Previous testimonial"
              className="w-10 h-10 border border-[#C4949F] text-[#8B1535] flex items-center justify-center hover:bg-[#8B1535] hover:text-white hover:border-[#8B1535] transition-colors"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 5H0M4 1L0 5l4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % total)}
              aria-label="Next testimonial"
              className="w-10 h-10 border border-[#C4949F] text-[#8B1535] flex items-center justify-center hover:bg-[#8B1535] hover:text-white hover:border-[#8B1535] transition-colors"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M0 5h14M10 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
