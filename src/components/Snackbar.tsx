import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

export type SnackbarVariant = 'added' | 'removed'

interface SnackbarProps {
  open: boolean
  message: string
  variant?: SnackbarVariant
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
  duration?: number
}

export function Snackbar({
  open,
  message,
  variant = 'added',
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
}: SnackbarProps) {
  useEffect(() => {
    if (!open || !duration) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])

  if (!open) return null

  const isAdded = variant === 'added'
  const iconSrc = isAdded ? '/Asset%2011.png' : '/Asset%2010.png'
  const showAction = actionLabel && onAction

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] p-4 max-w-lg w-full pointer-events-none flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div
        className={`rounded-2xl shadow-2xl flex items-center gap-4 min-h-[72px] lg:min-h-[80px] px-4 py-3 border-2 max-w-lg w-full pointer-events-auto opacity-0 snackbar-enter ${
          isAdded ? 'bg-brand-yellow text-gray-900 border-amber-400' : 'bg-brand-red text-white border-red-800'
        }`}
      >
        <img
          src={iconSrc}
          alt=""
          className="w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0 object-contain"
          aria-hidden
        />
        <span className="flex-1 text-sm lg:text-base font-bold min-w-0">{message}</span>
        {showAction && (
          <button
            type="button"
            onClick={() => {
              onAction()
              onClose()
            }}
            className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium underline underline-offset-2 hover:no-underline ${
              isAdded ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
            }`}
          >
            {actionLabel}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}
