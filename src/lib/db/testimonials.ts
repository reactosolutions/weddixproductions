import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/types/database'

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data } = await supabase
      .from('testimonials').select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    return data ?? []
  } catch { return [] }
}
