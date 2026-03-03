import { Clock, LogOut, PlayCircle, Info } from 'lucide-react'
import type { Attraction } from '@/types/catalog'
import { formatWhatsAppText } from '@/utils/formatText'
import { getAllImages } from '@/utils/attractionImage'
import { Modal } from './Modal'
import { ImageCarousel } from './ImageCarousel'

const PLACEHOLDER_IMG = '/no-image.svg'

interface ItemDetailModalProps {
  item: Attraction | null
  open: boolean
  onClose: () => void
  onAddToCart: () => void
  onRemoveFromCart?: () => void
  onOpenCart?: () => void
  isInCart: boolean
  onWatchVideo?: () => void
}

export function ItemDetailModal({
  item,
  open,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onOpenCart,
  isInCart,
  onWatchVideo,
}: ItemDetailModalProps) {
  if (!item) return null

  const isTransport = item.category === 'Transportes'
  const labelStart = isTransport ? 'Saída' : 'Abertura'
  const labelEnd = isTransport ? 'Retorno' : 'Fechamento'
  const allImages = getAllImages(item, 1400)

  const whyWorthIt: string[] = []
  if (item.category === 'Ingressos') whyWorthIt.push('Muito procurado')
  if (item.category === 'Transportes') whyWorthIt.push('Praticidade no deslocamento')
  if (item.category === 'Restaurantes') whyWorthIt.push('Experiência gastronômica')
  if (item.video) whyWorthIt.push('Vídeo disponível')
  if (item.open || item.close) whyWorthIt.push('Horários informados')
  if (whyWorthIt.length === 0) whyWorthIt.push('Condições no orçamento pelo WhatsApp')

  const mediaCol = (
    <div className="relative flex-shrink-0">
      {allImages.length > 1 ? (
        <ImageCarousel images={allImages} alt={item.name} className="w-full" />
      ) : (
        <img
          src={allImages[0] || item.img || PLACEHOLDER_IMG}
          alt=""
          className="w-full h-64 lg:aspect-video lg:h-auto object-cover"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMG
          }}
        />
      )}
      {item.video && (
        <button
          type="button"
          onClick={onWatchVideo}
          className="cta-card-jackpot pulse-video absolute bottom-4 right-4 z-[80] bg-brand-red text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase flex items-center gap-2 border-2 border-white/50 hover:bg-brand-red-hover"
        >
          <PlayCircle className="w-4 h-4" />
          Assistir Vídeo
        </button>
      )}
    </div>
  )

  const infoCol = (
    <div className="p-6">
      <span className="bg-brand-yellow text-red-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
        {item.category}
      </span>
      <h3 className="font-black text-2xl text-brand-red uppercase italic mt-2 leading-tight">
        {item.name}
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.open && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase italic">
              {labelStart}: {item.open}
            </span>
          </div>
        )}
        {item.close && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase italic">
              {labelEnd}: {item.close}
            </span>
          </div>
        )}
      </div>
      <div
        className="mt-4 text-gray-600 text-sm leading-relaxed formatted-text"
        dangerouslySetInnerHTML={{ __html: formatWhatsAppText(item.desc) }}
      />
      {whyWorthIt.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
          <p className="font-black text-[10px] uppercase tracking-wider text-amber-800 mb-2">
            Por que vale a pena
          </p>
          <ul className="text-gray-700 text-sm space-y-1">
            {whyWorthIt.map((line) => (
              <li key={line} className="flex items-center gap-2">
                <span className="text-amber-500">•</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 p-4 bg-red-50 rounded-2xl border-2 border-red-200">
        <div className="flex items-center gap-2 mb-2 text-red-700">
          <Info className="w-4 h-4" />
          <span className="font-black text-[10px] uppercase tracking-wider">
            Tarifa Reduzida & Gratuidade
          </span>
        </div>
        <div
          className="text-gray-700 text-xs italic leading-snug formatted-text"
          dangerouslySetInnerHTML={{ __html: formatWhatsAppText(item.rules) }}
        />
      </div>
    </div>
  )

  const handleRemove = () => {
    onRemoveFromCart?.()
    onClose()
  }

  const ctaBar = (
    <div className="p-6 bg-white border-t flex gap-3 flex-shrink-0">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 py-4 font-black uppercase text-xs text-gray-300"
      >
        Voltar
      </button>
      {onRemoveFromCart && isInCart ? (
        <button
          type="button"
          onClick={handleRemove}
          className="cta-card-jackpot flex-[2] py-4 rounded-2xl font-black uppercase italic shadow-xl text-sm bg-brand-red text-white hover:bg-brand-red-hover"
        >
          Remover do Orçamento
        </button>
      ) : (
        <button
          type="button"
          onClick={
            isInCart
              ? () => {
                  onOpenCart?.()
                  onClose()
                }
              : onAddToCart
          }
          className={`flex-[2] py-4 rounded-2xl font-black uppercase italic shadow-xl text-sm ${
            isInCart
              ? 'bg-brand-red/90 text-white hover:bg-brand-red-hover cursor-pointer border-2 border-brand-red'
              : 'cta-card-jackpot bg-brand-red text-white hover:bg-brand-red-hover'
          }`}
        >
          {isInCart ? 'Já selecionado' : 'Selecionar oferta'}
        </button>
      )}
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} title={item.name} variant="center" size="xl">
      {/* Layout único: foto no topo, info abaixo, CTA fixo — mobile e desktop */}
      <div className="flex flex-col max-h-[95vh] lg:max-h-[90vh]">
        <div className="modal-scroll-area hide-scrollbar flex-1 min-h-0">
          {mediaCol}
          {infoCol}
        </div>
        {ctaBar}
      </div>
    </Modal>
  )
}
