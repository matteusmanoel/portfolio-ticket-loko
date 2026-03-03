import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

type ModalVariant = 'sheet' | 'center'
type ModalSize = 'md' | 'lg' | 'xl'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  variant?: ModalVariant
  size?: ModalSize
}

const sizeClasses: Record<ModalSize, string> = {
  md: 'lg:max-w-md',
  lg: 'lg:max-w-3xl',
  xl: 'lg:max-w-[1100px]',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
  variant = 'sheet',
  size = 'md',
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (open && ref.current) {
      const focusables = ref.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusables[0] as HTMLElement | undefined
      first?.focus()
    }
  }, [open])

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const isCenter = variant === 'center'
  const overlayClasses = isCenter
    ? 'items-end lg:items-center'
    : 'items-end sm:items-center'
  const contentClasses = isCenter
    ? `w-full rounded-t-[3rem] max-h-[95vh] lg:rounded-3xl lg:max-h-[90vh] ${sizeClasses[size]}`
    : 'w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] max-h-[95vh]'

  return (
    <div
      className={`fixed inset-0 z-[70] modal-overlay flex justify-center p-0 opacity-0 animate-[modalOverlayFadeIn_0.2s_ease-out_forwards] ${overlayClasses}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={handleBackdropClick}
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white overflow-hidden border-t-8 border-brand-red flex flex-col relative shadow-2xl opacity-0 animate-[modalContentSlideIn_0.2s_ease-out_0.05s_forwards] ${contentClasses} ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full z-[80]"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
        {title && (
          <h2 id="modal-title" className="sr-only">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}
