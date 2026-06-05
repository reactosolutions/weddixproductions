import { createClient } from '@/lib/supabase/server'
import GalleryManager from './GalleryManager'

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#2A1018] mb-8">Gallery</h1>
      <GalleryManager initialItems={items ?? []} />
    </div>
  )
}
