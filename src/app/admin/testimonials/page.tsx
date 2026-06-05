import { createClient } from '@/lib/supabase/server'
import TestimonialsManager from './TestimonialsManager'

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-8">Testimonials</h1>
      <TestimonialsManager initialItems={items ?? []} />
    </div>
  )
}
