export type GalleryImage = {
  id:          string
  image_url:   string | null
  caption:     string | null
  category:    string
  aspect:      string
  media_type:  'image' | 'video'
  featured:    boolean
  order_index: number
  is_active:   boolean
  created_at:  string
  updated_at:  string
}

export type Testimonial = {
  id:                string
  client_name:       string
  client_title:      string | null
  client_avatar_url: string | null
  content:           string
  rating:            number | null
  is_active:         boolean
  created_at:        string
  updated_at:        string
}

export type Database = {
  public: {
    Tables: {
      gallery_images: {
        Row:    GalleryImage
        Insert: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>>
      }
      testimonials: {
        Row:    Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
