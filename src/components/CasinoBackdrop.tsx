/**
 * Full-page casino-style backdrop: rays (Asset 12) + vinheta + central glow.
 * Optional sparkles are CSS-only (no extra asset). Content sits above via sibling/child.
 */
export function CasinoBackdrop() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      {/* Layer 1: rays base */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/Asset%2012.png')",
        }}
      />
      {/* Layer 2: vinheta — darken edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 100% 100% at 50% 40%,
              transparent 0%,
              transparent 45%,
              rgba(0,0,0,0.25) 85%,
              rgba(0,0,0,0.5) 100%
            )
          `,
        }}
      />
      {/* Layer 3: central glow (gold/amber behind hero area) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 120% 80% at 50% 15%,
              rgba(255, 237, 0, 0.12) 0%,
              rgba(255, 200, 50, 0.06) 30%,
              transparent 60%
            )
          `,
        }}
      />
      {/* Layer 4: optional soft sparkles (few large blurred dots, low opacity) */}
      <div className="absolute inset-0 overflow-hidden">
        <span className="casino-sparkle casino-sparkle-1" />
        <span className="casino-sparkle casino-sparkle-2" />
        <span className="casino-sparkle casino-sparkle-3" />
        <span className="casino-sparkle casino-sparkle-4" />
        <span className="casino-sparkle casino-sparkle-5" />
      </div>
    </div>
  )
}
