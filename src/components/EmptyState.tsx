interface EmptyStateProps {
  imageSrc: string
  imageAlt?: string
  title: string
  subtitle?: string
  className?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  imageSrc,
  imageAlt = '',
  title,
  subtitle,
  className = '',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center min-h-[40vh] py-12 px-4 ${className}`}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-36 h-auto object-contain opacity-90 mb-6"
        loading="lazy"
        decoding="async"
      />
      <p className="text-base font-semibold text-gray-600 max-w-xs">{title}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-2 max-w-xs">{subtitle}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 px-6 py-3 rounded-2xl bg-brand-red text-white font-bold uppercase text-sm hover:bg-brand-red-hover transition-colors shadow-lg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
