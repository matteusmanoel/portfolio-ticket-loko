import { MapPin } from 'lucide-react'
import { PICKUP_POINTS } from '@/data/pickupPoints'

interface PickupPointsFabProps {
  onOpen: () => void
}

export function PickupPointsFab({ onOpen }: PickupPointsFabProps) {
  if (PICKUP_POINTS.length === 0) return null

  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed left-4 bottom-20 lg:bottom-6 z-[35] flex items-center gap-2 bg-brand-red text-white px-4 py-3 rounded-2xl shadow-lg border-2 border-red-800/30 hover:bg-brand-red-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red"
      aria-label="Encontre-nos - Ver pontos de retirada de ingressos"
    >
      <MapPin className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
      <span className="text-sm font-black uppercase">Encontre-nos</span>
    </button>
  )
}
