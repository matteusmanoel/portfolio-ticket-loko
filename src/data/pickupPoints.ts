export const PICKUP_WHATSAPP = '554535214040'
export const PICKUP_WHATSAPP_DISPLAY = '(45) 3521 4040'
export const PICKUP_WHATSAPP_URL = `https://wa.me/${PICKUP_WHATSAPP}`
export const PICKUP_WHATSAPP_HINT =
  'Consulte o horário de funcionamento através do nosso WhatsApp ' + PICKUP_WHATSAPP_DISPLAY

export interface PickupPoint {
  id: string
  name: string
  address: string
  description?: string
  placeId: string
}

export const PICKUP_POINTS: PickupPoint[] = [
  {
    id: 'cataratas-jl-shopping',
    name: 'Cataratas JL Shopping',
    address: 'Avenida Costa e Silva, 185 - Centro',
    description: 'Piso L1, em frente ao Mercado Muffato',
    placeId: 'ChIJr6WqeE-R9pQRNpe1obHfUrE',
  },
  {
    id: 'shopping-catuai-palladium',
    name: 'Shopping Catuaí Palladium',
    address: 'Avenida das Cataratas, 3570 - Vila Yolanda',
    description: 'Em frente à praça de alimentação, 2º andar do shopping',
    placeId: 'ChIJz1z3AoCR9pQRjGTbfPGIS9w',
  },
  {
    id: 'avenida-brasil-ailabiu',
    name: 'Avenida Brasil (Ailabiu)',
    address: 'Av. Brasil, 74 - Centro',
    description: 'Anexo à Ailabiu e ao lado do Hotel Águas do Iguaçu',
    placeId: 'ChIJa_uF3EeQ9pQRrm5L-qooiB8',
  },
]

export function getMapsUrlForPlaceId(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`
}
