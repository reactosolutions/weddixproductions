import { Suspense } from 'react'
import { getTestimonials } from '@/lib/db/testimonials'
import Hero from './_home/Hero'
import GallerySection from './_home/GallerySection'
import ServicesSection from './_home/ServicesSection'
import AboutTeaser from './_home/AboutTeaser'
import Testimonials from './_home/Testimonials'
import ContactSection from './_home/ContactSection'

export default async function Page() {
  const testimonials = await getTestimonials()
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="h-40 bg-white" />}>
        <GallerySection />
      </Suspense>
      <ServicesSection />
      <AboutTeaser />
      <Testimonials testimonials={testimonials} />
      <ContactSection />
    </>
  )
}
