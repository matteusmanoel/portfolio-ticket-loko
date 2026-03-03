import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Pct = { id: string; text: string; top: string; left: string; rotate: number; size: number; delay: number }
type Spark = { id: string; top: string; left: string; size: number; delay: number }
type Conf = { id: string; top: string; left: string; w: number; h: number; rotate: number; delay: number; duration: number }

const PERCENTS: Pct[] = [
  { id: 'p1', text: '10%', top: '8%', left: '6%', rotate: -10, size: 34, delay: 0.2 },
  { id: 'p2', text: '20%', top: '14%', left: '78%', rotate: 12, size: 30, delay: 0.6 },
  { id: 'p3', text: '15%', top: '62%', left: '10%', rotate: -6, size: 28, delay: 0.4 },
  { id: 'p4', text: '25%', top: '70%', left: '82%', rotate: 8, size: 32, delay: 0.9 },
  { id: 'p5', text: '30%', top: '38%', left: '90%', rotate: -14, size: 26, delay: 0.3 },
  { id: 'p6', text: '20%', top: '88%', left: '40%', rotate: 6, size: 36, delay: 1.1 },
]

const SPARKLES: Spark[] = [
  { id: 's1', top: '10%', left: '18%', size: 110, delay: 0.2 },
  { id: 's2', top: '18%', left: '86%', size: 80, delay: 0.8 },
  { id: 's3', top: '44%', left: '12%', size: 140, delay: 1.1 },
  { id: 's4', top: '56%', left: '76%', size: 100, delay: 0.6 },
  { id: 's5', top: '78%', left: '26%', size: 90, delay: 0.9 },
  { id: 's6', top: '86%', left: '72%', size: 120, delay: 0.4 },
]

const CONFETTI: Conf[] = [
  { id: 'c1', top: '8%', left: '22%', w: 10, h: 18, rotate: 18, delay: 0.1, duration: 7.5 },
  { id: 'c2', top: '12%', left: '54%', w: 8, h: 14, rotate: -12, delay: 0.6, duration: 8.2 },
  { id: 'c3', top: '20%', left: '88%', w: 12, h: 20, rotate: 8, delay: 0.3, duration: 9.4 },
  { id: 'c4', top: '48%', left: '6%', w: 9, h: 16, rotate: -18, delay: 0.9, duration: 8.8 },
  { id: 'c5', top: '60%', left: '92%', w: 10, h: 18, rotate: 12, delay: 0.2, duration: 7.9 },
  { id: 'c6', top: '76%', left: '14%', w: 12, h: 22, rotate: -6, delay: 1.1, duration: 9.8 },
  { id: 'c7', top: '82%', left: '58%', w: 8, h: 14, rotate: 16, delay: 0.5, duration: 7.2 },
  { id: 'c8', top: '34%', left: '40%', w: 10, h: 18, rotate: -10, delay: 0.7, duration: 8.6 },
]

export function CasinoScene() {
  const reduced = useReducedMotion()
  const [raysLoaded, setRaysLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = '/Asset%2012.png'
    img.onload = () => setRaysLoaded(true)
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      {/* Instant fallback rays (no network), then fade-in the PNG when ready */}
      <div className="absolute inset-0 casino-fallback-rays" />
      <div
        className={`absolute inset-0 casino-rays-image ${raysLoaded ? 'is-loaded' : ''}`}
        style={{ backgroundImage: "url('/Asset%2012.png')" }}
      />
      <div className="absolute inset-0 casino-vignette" />
      <div className="absolute inset-0 casino-hero-glow" />

      {/* A soft moving highlight sweep across the whole background */}
      <div className="absolute inset-0 casino-bg-sweep" />

      {/* Sparkles (bigger, more visible than before) */}
      {SPARKLES.map((s) => (
        <motion.span
          key={s.id}
          className="casino-sparkle2"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          initial={false}
          animate={
            reduced
              ? { opacity: 0.18 }
              : { opacity: [0.16, 0.55, 0.18], scale: [1, 1.06, 1] }
          }
          transition={
            reduced
              ? undefined
              : { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay }
          }
        />
      ))}

      {/* Confetti chips */}
      {CONFETTI.map((c) => (
        <motion.span
          key={c.id}
          className="casino-confetti"
          style={{ top: c.top, left: c.left, width: c.w, height: c.h, rotate: c.rotate }}
          initial={false}
          animate={
            reduced
              ? { opacity: 0.22 }
              : { y: [0, -10, 0], x: [0, 6, 0], opacity: [0.18, 0.32, 0.2], rotate: [c.rotate, c.rotate + 10, c.rotate] }
          }
          transition={
            reduced
              ? undefined
              : { duration: c.duration, repeat: Infinity, ease: 'easeInOut', delay: c.delay }
          }
        />
      ))}

      {/* Decorative percents (subtle, blurred, floating) */}
      {PERCENTS.map((p) => (
        <motion.div
          key={p.id}
          className="casino-percent"
          style={{
            top: p.top,
            left: p.left,
            rotate: p.rotate,
            fontSize: p.size,
          }}
          initial={false}
          animate={
            reduced
              ? { opacity: 0.12 }
              : { y: [0, -8, 0], opacity: [0.1, 0.18, 0.12], rotate: [p.rotate, p.rotate + 2, p.rotate] }
          }
          transition={reduced ? undefined : { duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        >
          {p.text}
        </motion.div>
      ))}
    </div>
  )
}

