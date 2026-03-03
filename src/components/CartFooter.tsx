import { FolderHeart } from 'lucide-react'

interface CartFooterProps {
  count: number
  onOpen: () => void
}

export function CartFooter({ count, onOpen }: CartFooterProps) {
  if (count === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t-2 border-red-300 max-w-md mx-auto z-40">
      <button
        type="button"
        onClick={onOpen}
        className="cta-jackpot cta-shine w-full bg-brand-red text-white py-4 rounded-2xl font-black uppercase italic shadow-2xl flex items-center justify-between px-6 transform active:scale-95 transition-all hover:bg-brand-red-hover"
      >
        <div className="flex items-center gap-2">
          <FolderHeart className="w-5 h-5" />
          <span>Prosseguir para orçamento</span>
        </div>
        <span className="bg-white text-brand-red min-w-[1.75rem] h-6 px-2 rounded-full text-sm font-black flex items-center justify-center">
          {count}
        </span>
      </button>
    </div>
  )
}
