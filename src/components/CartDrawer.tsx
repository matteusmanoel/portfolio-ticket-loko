import { useEffect, useState } from 'react'
import { X, Trash2, MessageCircle } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ExpandableTextarea } from '@/components/ExpandableTextarea'
import { useCartStore } from '@/features/cart/cartStore'
import { buildRequestMessage, getWhatsAppUrl } from '@/features/whatsapp/buildMessage'
import { getStoredVendor, getVendorFromQuery } from '@/features/vendor/vendorFromQuery'
import { getDisplayImage } from '@/utils/attractionImage'
import { ImageWithSkeleton } from '@/components/ImageWithSkeleton'
import type { Attraction } from '@/types/catalog'

const PLACEHOLDER_IMG = '/no-image.svg'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  catalogItems?: Attraction[]
  onOpenItemDetail?: (item: Attraction) => void
  onItemRemoved?: () => void
  onCartCleared?: () => void
}

export function CartDrawer({ open, onClose, catalogItems = [], onOpenItemDetail, onItemRemoved, onCartCleared }: CartDrawerProps) {
  const { items, groupDetails, setGroupDetails, removeItem, clearCart } = useCartStore()
  const [imgErrorIds, setImgErrorIds] = useState<Set<string>>(new Set())

  const getAttraction = (id: string): Attraction | null =>
    catalogItems.find((a) => a.id === id) ?? null
  const vendor = getStoredVendor() ?? getVendorFromQuery()

  const handleClearCart = () => {
    clearCart()
    onCartCleared?.()
    onClose()
  }

  const canRequest = vendor?.isValid && vendor.wpp
  const message = buildRequestMessage(items, groupDetails)
  const whatsappUrl = canRequest ? getWhatsAppUrl(vendor.wpp, message) : null

  const handleRequestQuote = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      onClose()
    }
  }

  useEffect(() => {
    if (!open) return
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[90] drawer-overlay flex items-end justify-center lg:items-stretch lg:justify-end opacity-0 animate-[modalOverlayFadeIn_0.2s_ease-out_forwards]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md lg:max-w-none lg:w-[420px] rounded-t-[3rem] lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden border-t-8 lg:border-t-0 lg:border-l-8 border-red-300 flex flex-col h-[85vh] lg:h-full relative shadow-2xl opacity-0 animate-[drawerSlideIn_0.2s_ease-out_0.05s_forwards] lg:animate-[drawerSlideInRight_0.25s_ease-out_0.05s_forwards]"
      >
        <div className="bg-brand-red p-6 border-b-4 border-brand-yellow flex justify-between items-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.10] casino-header-texture pointer-events-none"
            aria-hidden
          />
          <div className="relative z-10 flex-1 flex justify-between items-center">
            <div>
              <h2
                id="cart-drawer-title"
                className="font-black text-white uppercase italic text-xl"
              >
                Seu orçamento está quase pronto
              </h2>
              <p className="text-[10px] font-bold text-brand-yellow">Envie e receba condições no WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-white/20 text-white p-2 rounded-xl hover:bg-white/30 border border-brand-yellow/50"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {items.length === 0 ? (
            <EmptyState
              imageSrc="/Asset 8.png"
              title="Nenhum item no orçamento."
              subtitle="Adicione itens pelo catálogo."
              className="min-h-[30vh] py-8"
              actionLabel="Ver catálogo"
              onAction={onClose}
            />
          ) : (
            <>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs text-gray-400 font-bold uppercase w-full text-center py-2"
                >
                  Limpar orçamento
                </button>
              )}
              {items.map((it) => {
                const attraction = getAttraction(it.id)
                const rawImgSrc = attraction && getDisplayImage(attraction, 256) ? getDisplayImage(attraction, 256)! : PLACEHOLDER_IMG
                const imgSrc = imgErrorIds.has(it.id) ? PLACEHOLDER_IMG : rawImgSrc
                const isClickable = attraction && onOpenItemDetail
                return (
                  <div
                    key={it.id}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onClick={isClickable ? () => onOpenItemDetail(attraction) : undefined}
                    onKeyDown={isClickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onOpenItemDetail(attraction) : undefined}
                    className={`bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col ${isClickable ? 'cursor-pointer hover:border-red-300 active:scale-[0.99] transition-all' : ''}`}
                  >
                    <div className="flex gap-3 p-3">
                      <div className={`w-20 h-20 flex-shrink-0 rounded-xl bg-gray-100 overflow-hidden relative ${imgSrc === PLACEHOLDER_IMG ? 'flex items-center justify-center' : ''}`}>
                        <ImageWithSkeleton
                          src={imgSrc}
                          alt=""
                          imgClassName="object-cover"
                          isPlaceholder={imgSrc === PLACEHOLDER_IMG}
                          loading="lazy"
                          onError={() => setImgErrorIds((prev) => new Set(prev).add(it.id))}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h5 className="font-bold text-sm lg:text-base uppercase text-gray-800 leading-tight line-clamp-2">
                          {it.name}
                        </h5>
                        {attraction && (
                          <span className="text-[10px] lg:text-xs text-gray-500 mt-0.5">
                            {attraction.category}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeItem(it.id)
                          onItemRemoved?.()
                        }}
                        className="text-red-600 p-2 self-center rounded-lg hover:bg-red-50 flex-shrink-0"
                        aria-label={`Remover ${it.name}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
        <div className="p-6 bg-white border-t space-y-4">
          <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
            <ExpandableTextarea
              id="group-details"
              label="Informações do Grupo"
              labelClassName="text-[10px] font-black uppercase text-gray-400 block mb-2 italic"
              value={groupDetails}
              onChange={setGroupDetails}
              rows={3}
              className="border-0 bg-transparent text-sm text-gray-700 focus:outline-none resize-none shadow-none"
              expandModalTitle="Informações do Grupo"
              placeholder="Ex: 1 adulto inteira, 1 adulto estudante, 1 maior de 60 anos, 1 criança de 7 anos"
            />
          </div>
          {!canRequest && items.length > 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl">
              Este link não foi enviado por um vendedor. Para solicitar orçamento,
              use o link que o vendedor te passou (com WhatsApp dele).
            </p>
          )}
          <button
            type="button"
            onClick={handleRequestQuote}
            disabled={!canRequest || items.length === 0}
            className="cta-jackpot cta-jackpot-whatsapp cta-shine w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black uppercase italic shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Prosseguir para WhatsApp</span>
          </button>
          <p className="text-[10px] text-gray-500 text-center">
            Valores e disponibilidade sob consulta.
          </p>
        </div>
      </div>
    </div>
  )
}
