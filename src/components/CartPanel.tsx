import { Trash2, MessageCircle } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ExpandableTextarea } from '@/components/ExpandableTextarea'
import { useCartStore } from '@/features/cart/cartStore'
import { buildRequestMessage, getWhatsAppUrl } from '@/features/whatsapp/buildMessage'
import { getStoredVendor, getVendorFromQuery } from '@/features/vendor/vendorFromQuery'

interface CartPanelProps {
  onClearCart?: () => void
}

export function CartPanel({ onClearCart }: CartPanelProps) {
  const { items, groupDetails, setGroupDetails, removeItem, clearCart } = useCartStore()
  const vendor = getStoredVendor() ?? getVendorFromQuery()

  const handleClearCart = () => {
    clearCart()
    onClearCart?.()
  }

  const canRequest = vendor?.isValid && vendor.wpp
  const message = buildRequestMessage(items, groupDetails)
  const whatsappUrl = canRequest ? getWhatsAppUrl(vendor.wpp, message) : null

  const handleRequestQuote = () => {
    if (whatsappUrl) window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:w-[420px] lg:flex-shrink-0 bg-white border-l border-gray-200 shadow-2xl rounded-l-3xl overflow-hidden"
      aria-label="Meu orçamento"
    >
      <div className="bg-brand-yellow p-6 border-b-4 border-brand-red">
        <h2 className="font-black text-brand-red uppercase italic text-lg">
          Meu Orçamento
        </h2>
        <p className="text-[10px] font-bold text-red-700 mt-0.5">PASTA DE INTERESSE</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50 min-h-0">
        {items.length === 0 ? (
          <EmptyState
            imageSrc="/Asset 8.png"
            title="Nenhum item no orçamento."
            subtitle="Adicione itens pelo catálogo."
            className="min-h-[25vh] py-6"
          />
        ) : (
          <>
            {items.length > 1 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs text-gray-400 font-bold uppercase w-full text-center py-2 hover:text-gray-600"
              >
                Limpar orçamento
              </button>
            )}
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-2 bg-white p-3 rounded-2xl border-2 border-gray-100 shadow-sm"
              >
                <span className="flex-1 font-bold text-[11px] uppercase text-gray-700 truncate">
                  {it.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                  aria-label={`Remover ${it.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="p-6 bg-white border-t space-y-4">
        <div className="bg-gray-50 p-3 rounded-2xl border-2 border-gray-100">
          <ExpandableTextarea
            id="group-details-panel"
            label="Informações do Grupo"
            labelClassName="text-[10px] font-black uppercase text-gray-400 block mb-1 italic"
            value={groupDetails}
            onChange={setGroupDetails}
            rows={2}
            className="border-0 bg-transparent text-sm text-gray-700 focus:outline-none resize-none shadow-none"
            expandModalTitle="Informações do Grupo"
            placeholder="Ex: 1 adulto, 1 criança..."
          />
        </div>
        {!canRequest && items.length > 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl">
            Use o link do vendedor para solicitar orçamento.
          </p>
        )}
        <button
          type="button"
          onClick={handleRequestQuote}
          disabled={!canRequest || items.length === 0}
          className="w-full bg-brand-red text-white py-4 rounded-2xl font-black uppercase italic shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:bg-brand-red-hover"
        >
          <MessageCircle className="w-4 h-4" />
          Solicitar Orçamento
        </button>
      </div>
    </aside>
  )
}
