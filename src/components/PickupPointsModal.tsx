import { useEffect } from 'react'
import { X, MapPin, ExternalLink } from 'lucide-react'
import {
  PICKUP_POINTS,
  PICKUP_WHATSAPP_DISPLAY,
  PICKUP_WHATSAPP_URL,
  getMapsUrlForPlaceId,
} from '@/data/pickupPoints'

interface PickupPointsModalProps {
  open: boolean
  onClose: () => void
}

export function PickupPointsModal({ open, onClose }: PickupPointsModalProps) {
  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open, onClose])

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[85] drawer-overlay flex items-end justify-center lg:items-center opacity-0 animate-[modalOverlayFadeIn_0.2s_ease-out_forwards]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pickup-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md lg:max-w-lg lg:rounded-3xl overflow-hidden border-t-8 lg:border-8 border-red-300 flex flex-col max-h-[85vh] lg:max-h-[90vh] relative shadow-2xl opacity-0 animate-[drawerSlideIn_0.2s_ease-out_0.05s_forwards]"
      >
        <div className="bg-brand-red p-6 border-b-4 border-brand-yellow flex justify-between items-center relative overflow-hidden flex-shrink-0">
          <div
            className="absolute inset-0 opacity-[0.10] casino-header-texture pointer-events-none"
            aria-hidden
          />
          <div className="relative z-10 flex-1 flex justify-between items-center">
            <h2
              id="pickup-modal-title"
              className="font-black text-white uppercase italic text-lg lg:text-xl pr-2"
            >
              Pontos ideais para retirada de ingressos
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="bg-white/20 text-white p-2 rounded-xl hover:bg-white/30 border border-brand-yellow/50 flex-shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 hide-scrollbar">
          {PICKUP_POINTS.map((point) => (
            <article
              key={point.id}
              className="bg-white rounded-2xl overflow-hidden border-2 border-amber-200/60 shadow-sm"
            >
              <div className="flex gap-3 p-4">
                <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-brand-red" strokeWidth={2} aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm lg:text-base uppercase italic text-gray-800">
                    {point.name}
                  </h3>
                  {point.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{point.description}</p>
                  )}
                  <p className="text-xs text-gray-700 mt-1">{point.address}</p>
                </div>
              </div>
              <div className="px-4 pb-3 space-y-2">
                <p className="text-[11px] text-gray-500">
                  Consulte o horário de funcionamento através do nosso WhatsApp{' '}
                  <a
                    href={PICKUP_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red font-semibold underline hover:text-brand-red-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-1 rounded"
                  >
                    {PICKUP_WHATSAPP_DISPLAY}
                  </a>
                </p>
                <a
                  href={getMapsUrlForPlaceId(point.placeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-brand-red-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver no Google Maps
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
