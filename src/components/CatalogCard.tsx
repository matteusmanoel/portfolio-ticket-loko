import { useState } from 'react'
import { Play, Plus, Check, Info } from 'lucide-react'
import type { Attraction } from '@/types/catalog'
import { plainText } from '@/utils/formatText'
import { getDisplayImage } from '@/utils/attractionImage'

const PLACEHOLDER_IMG = '/no-image.svg'

interface CatalogCardProps {
  item: Attraction
  variant?: 'list' | 'grid'
  onClick: () => void
  onQuickAdd?: () => void
  onWatchVideo?: () => void
  isInCart?: boolean
}

export function CatalogCard({
  item,
  variant = 'list',
  onClick,
  onQuickAdd,
  onWatchVideo,
  isInCart = false,
}: CatalogCardProps) {
  const [imgError, setImgError] = useState(false)
  const display = getDisplayImage(item, variant === 'grid' ? 720 : 640)
  const imgSrc = display && !imgError ? display : PLACEHOLDER_IMG
  const desc = plainText(item.desc)

  const handleCardClick = () => onClick()
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isInCart && onQuickAdd) onQuickAdd()
  }
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.video && onWatchVideo) onWatchVideo()
  }

  const isGrid = variant === 'grid'

  if (isGrid) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
        className="card-sticker card-ticket-edge cv-auto contain-paint w-full bg-white rounded-3xl overflow-hidden border-0 cursor-pointer relative text-left transform active:scale-[0.98] transition-all hover:border-0 flex flex-col"
        aria-label={`Ver detalhes: ${item.name}`}
      >
        <div className="card-media-wrap relative w-full aspect-square lg:aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-3xl">
          <img
            src={imgSrc}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
          <div
            className="absolute top-2 right-2 lg:top-4 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black/50 text-white flex items-center justify-center z-10 animate-[infoPulse_2s_ease-in-out_infinite] shadow-lg"
            title="Clique para ver mais detalhes"
            aria-hidden
          >
            <Info className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
          </div>
        </div>
        <div className="p-3 lg:p-5 flex flex-col flex-1 min-w-0">
          <span className="card-category-pill bg-brand-yellow/90 text-red-800 text-[7px] lg:text-[10px] font-black px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full uppercase w-fit tracking-wide">
            {item.category}
          </span>
          <h4 className="font-black text-[12px] lg:text-base uppercase italic text-gray-800 leading-tight mt-1.5 line-clamp-2">
            {item.name}
          </h4>
        </div>
        <div className="flex border-t border-amber-200/60 mt-auto">
          {item.video ? (
            <>
              <button
                type="button"
                onClick={handleVideoClick}
                className="cta-card-jackpot flex-1 flex items-center justify-center gap-1.5 lg:gap-2 py-2.5 lg:py-4 bg-gray-800 text-white text-[10px] lg:text-sm font-black uppercase hover:bg-gray-700 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
                aria-label={`Assistir vídeo de ${item.name}`}
              >
                <Play className="w-3 h-3 lg:w-4 lg:h-4 fill-current" />
                Vídeo
              </button>
              {isInCart ? (
                <span className="flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-green-500 text-white text-[10px] lg:text-sm font-black uppercase py-2.5 lg:py-4">
                  <Check className="w-3.5 h-3.5 lg:w-5 lg:h-5" strokeWidth={3} />
                  Adicionado
                </span>
              ) : onQuickAdd ? (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="cta-card-jackpot flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-brand-red text-white text-[10px] lg:text-sm font-black uppercase py-2.5 lg:py-4 hover:bg-brand-red-hover active:scale-95 transition-all"
                  aria-label={`Adicionar ${item.name} ao orçamento`}
                >
                  <Plus className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                  Adicionar
                </button>
              ) : null}
            </>
          ) : (
            isInCart ? (
              <span className="w-full flex items-center justify-center gap-1 lg:gap-2 bg-green-600 text-white text-[10px] lg:text-sm font-black uppercase py-2.5 lg:py-4 card-cta-added" aria-label="Adicionado ao orçamento">
                <Check className="w-3.5 h-3.5 lg:w-5 lg:h-5" strokeWidth={3} />
                Adicionado
              </span>
            ) : onQuickAdd ? (
              <button
                type="button"
                onClick={handleAddClick}
                className="cta-card-jackpot w-full flex items-center justify-center gap-1 lg:gap-2 bg-brand-red text-white text-[10px] lg:text-sm font-black uppercase py-2.5 lg:py-4 hover:bg-brand-red-hover active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
                aria-label={`Adicionar ${item.name} ao orçamento`}
              >
                <Plus className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                Adicionar
              </button>
            ) : null
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
      className="card-sticker card-ticket-edge w-full min-h-[140px] lg:min-h-[160px] bg-white rounded-2xl overflow-hidden border-0 cursor-pointer text-left transform active:scale-[0.98] transition-all hover:border-0 flex"
      aria-label={`Ver detalhes: ${item.name}`}
    >
      <div className="card-media-wrap relative w-36 h-36 lg:w-44 lg:h-44 flex-shrink-0 bg-gray-100 overflow-hidden rounded-l-2xl">
        <img
          src={imgSrc}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="flex-1 overflow-hidden min-w-0 p-3 lg:p-5 flex flex-col justify-center">
        <span className="card-category-pill bg-brand-yellow/90 text-red-800 text-[7px] lg:text-[10px] font-black px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full uppercase w-fit tracking-wide">
          {item.category}
        </span>
        <h4 className="font-black text-[12px] lg:text-base uppercase italic text-gray-800 leading-tight mt-1.5 line-clamp-2">
          {item.name}
        </h4>
        <p className="text-[9px] lg:text-sm text-gray-500 line-clamp-1 mt-0.5">{desc}</p>
      </div>
      <div className="flex flex-col justify-center gap-1.5 lg:gap-2 p-2 lg:p-4 flex-shrink-0 border-l-2 border-amber-200/50 bg-amber-50/30 rounded-r-2xl">
        {item.video && (
          <button
            type="button"
            onClick={handleVideoClick}
            className="cta-card-jackpot flex items-center justify-center gap-1.5 lg:gap-2 bg-gray-800 text-white px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-[8px] lg:text-sm font-black uppercase hover:bg-gray-700 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
            aria-label={`Assistir vídeo de ${item.name}`}
          >
            <Play className="w-2.5 h-2.5 lg:w-4 lg:h-4 fill-current" />
            Vídeo
          </button>
        )}
        {isInCart ? (
          <span
            className="flex items-center justify-center gap-1.5 lg:gap-2 bg-green-600 text-white px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-[9px] lg:text-sm font-black uppercase card-cta-added"
            aria-label="Adicionado ao orçamento"
          >
            <Check className="w-3 h-3 lg:w-5 lg:h-5" strokeWidth={3} />
            Adicionado
          </span>
        ) : onQuickAdd ? (
          <button
            type="button"
            onClick={handleAddClick}
            className="cta-card-jackpot flex items-center justify-center gap-1.5 lg:gap-2 bg-brand-red text-white px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-[9px] lg:text-sm font-black uppercase hover:bg-brand-red-hover active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
            aria-label={`Adicionar ${item.name} ao orçamento`}
          >
            <Plus className="w-3 h-3 lg:w-5 lg:h-5" />
            Adicionar
          </button>
        ) : null}
      </div>
    </div>
  )
}
