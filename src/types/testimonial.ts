export interface Testimonial {
  id: string
  client_name: string
  location: string | null
  vehicle_info: string
  rating: number
  text_content: string
  avatar_url: string | null
  is_approved: boolean
  created_at: string
}

export type NewTestimonial = Omit<Testimonial, 'id' | 'created_at'>
export type EditableTestimonial = Omit<Testimonial, 'id' | 'created_at'>
