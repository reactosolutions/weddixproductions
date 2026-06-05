import { supabase } from '@/lib/supabase'
import type { GalleryItem } from '@/types/database'

export async function getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(10)

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('category', category)
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}
