import { supabase } from '@/lib/supabase'
import type { GalleryImage } from '@/types/database'

export async function getFeaturedGalleryItems(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('featured', true)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .limit(10)

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllGalleryItems(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getGalleryItemsByCategory(category: string): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}
