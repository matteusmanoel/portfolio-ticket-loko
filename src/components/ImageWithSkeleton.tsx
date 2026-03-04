import { useState, useCallback } from 'react'

const PLACEHOLDER_SRC = '/no-image.svg'

export interface ImageWithSkeletonProps {
  src: string
  alt?: string
  /** Container wrapper class (aspect, bg, rounded, etc.) */
  className?: string
  /** Classes for the <img> when visible (object-cover, object-contain, etc.) */
  imgClassName?: string
  /** When true, show placeholder icon style (centered, reduced opacity) */
  isPlaceholder?: boolean
  loading?: 'lazy' | 'eager'
  onError?: () => void
  onLoad?: () => void
}

/**
 * Renders a skeleton while the image loads, then reveals the image only when fully loaded
 * to avoid progressive/stuttering appearance. On error, shows placeholder.
 */
export function ImageWithSkeleton({
  src,
  alt = '',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  isPlaceholder = false,
  loading = 'lazy',
  onError,
  onLoad,
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const effectiveSrc = error || isPlaceholder ? PLACEHOLDER_SRC : src
  const showPlaceholderStyle = error || isPlaceholder
  const showSkeleton = !showPlaceholderStyle && !loaded

  const handleLoad = useCallback(() => {
    setLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setError(true)
    setLoaded(false)
    onError?.()
  }, [onError])

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      aria-busy={showSkeleton}
    >
      {/* Skeleton: visible only while image is loading (and not placeholder/error) */}
      {showSkeleton && (
        <div
          className="absolute inset-0 bg-gray-200 image-skeleton-shimmer"
          aria-hidden
        />
      )}
      <img
        src={effectiveSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
          showPlaceholderStyle
            ? 'max-w-[45%] max-h-[45%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain opacity-35'
            : imgClassName
        } ${!showPlaceholderStyle && !loaded ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  )
}
