export type VehicleCategory = 'suv' | 'hatch' | 'sedan' | 'moto' | 'utilitario' | 'picape' | 'tuning'
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
  image: string        // foto principal (compatibilidade)
  images?: string[]    // até 8 fotos
  features: string[]
  highlighted?: boolean
  color?: string
  fuel?: string
}
