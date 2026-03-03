/**
 * CSS-only casino background: red carpet + scattered golden glows.
 * Intentionally static (no animations) to keep CPU/GPU usage low.
 */
export function CasinoBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 casino-carpet-bg" />
      <div className="absolute inset-0 casino-carpet-vignette" />
      <div className="absolute inset-0 casino-carpet-sparkles" />
    </div>
  )
}

