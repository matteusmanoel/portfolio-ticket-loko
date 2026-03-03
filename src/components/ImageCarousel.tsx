import { useRef, useState, useEffect } from 'react'

interface ImageCarouselProps {
  images: string[]
  alt?: string
  className?: string
}

const PLACEHOLDER = '/no-image.svg'

export function ImageCarousel({ images, alt = '', className = '' }: ImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set())

  const urls = images.length ? images : [PLACEHOLDER]
  const displayUrl = (src: string, i: number) =>
    errorIndices.has(i) ? PLACEHOLDER : src

  useEffect(() => {
    const el = scrollRef.current
    if (!el || urls.length <= 1) return
    const onScroll = () => {
      const width = el.offsetWidth
      const i = Math.round(el.scrollLeft / width)
      setIndex(Math.min(i, urls.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [urls.length])

  const goTo = (i: number) => {
    const el = scrollRef.current
    if (el) {
      el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' })
      setIndex(i)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {urls.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="w-full flex-shrink-0 snap-center aspect-[4/3] lg:aspect-video bg-gray-100"
          >
            <img
              src={displayUrl(src, i)}
              alt={alt ? `${alt} ${i + 1}` : ''}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onError={() => setErrorIndices((prev) => new Set(prev).add(i))}
            />
          </div>
        ))}
      </div>
      {urls.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 lg:gap-2.5">
          {urls.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`rounded-full transition-all border-2 ${
                i === index
                  ? 'w-3 h-3 lg:w-3.5 lg:h-3.5 bg-brand-yellow border-black/30 shadow-lg ring-2 ring-black/30 scale-110'
                  : 'w-2.5 h-2.5 lg:w-3 lg:h-3 bg-black/40 border-white/70 hover:bg-black/60'
              }`}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
