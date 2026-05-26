import { Vehicle } from '@/types/vehicle'
import { WHATSAPP_NUMBER } from '@/lib/vehicles'

export const buildWhatsAppUrl = (vehicle?: Vehicle): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  if (!vehicle) {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os veículos da Popular Veículos.')
    return `${base}?text=${message}`
  }
  const vehicleName = `${vehicle.brand} ${vehicle.model}`
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(vehicle.price)

  const message = encodeURIComponent(
    `Olá, tenho interesse no ${vehicleName} ano ${vehicle.year} por ${priceFormatted} que vi no site!`
  )
  return `${base}?text=${message}`
}

export const buildTradeInUrl = (vehicleDescription: string): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  const message = encodeURIComponent(
    `Olá! Gostaria de avaliar meu veículo para troca: ${vehicleDescription}. Quando posso agendar?`
  )
  return `${base}?text=${message}`
}
