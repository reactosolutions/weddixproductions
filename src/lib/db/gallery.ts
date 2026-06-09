import { supabase } from '@/lib/supabase'
import type { GalleryImage } from '@/types/database'

export async function getFeaturedGalleryItems(): Promise<GalleryImage[]> {
  try {
    const { data } = await supabase
      .from('gallery_images').select('*')
      .eq('featured', true).eq('is_active', true)
      .order('order_index', { ascending: true }).limit(10)
    return data ?? []
  } catch { return [] }
}

export async function getAllGalleryItems(): Promise<GalleryImage[]> {
  try {
    const { data } = await supabase
      .from('gallery_images').select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    return data ?? []
  } catch { return [] }
}

export async function getGalleryItemsByCategory(category: string): Promise<GalleryImage[]> {
  try {
    const { data } = await supabase
      .from('gallery_images').select('*')
      .eq('category', category).eq('is_active', true)
      .order('order_index', { ascending: true })
    return data ?? []
  } catch { return [] }
}
