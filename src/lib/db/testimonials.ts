import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/types/database'

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}
