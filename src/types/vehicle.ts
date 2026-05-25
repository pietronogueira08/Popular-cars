export type VehicleCategory = 'carro' | 'moto' | 'tuning'
export type VehicleStatus = 'disponivel' | 'reservado' | 'vendido'

export interface Vehicle {
  id: string
  slug: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  category: VehicleCategory
  status: VehicleStatus
  description: string
  stage?: string
  image: string
  features: string[]
  highlighted?: boolean
  color?: string
  fuel?: string
}
