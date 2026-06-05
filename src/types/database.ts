export type GalleryItem = {
  id: string
  category: string
  label: string
  image_url: string | null
  aspect: string       // e.g. 'aspect-[2/3]' | 'aspect-[3/2]' | 'aspect-square'
  featured: boolean
  display_order: number
  created_at: string
}

export type Testimonial = {
  id: string
  quote: string
  client_name: string
  initials: string
  detail: string
  display_order: number
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      gallery_items: {
        Row: GalleryItem
        Insert: Omit<GalleryItem, 'id' | 'created_at'>
        Update: Partial<Omit<GalleryItem, 'id' | 'created_at'>>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at'>
        Update: Partial<Omit<Testimonial, 'id' | 'created_at'>>
      }
    }
  }
}
