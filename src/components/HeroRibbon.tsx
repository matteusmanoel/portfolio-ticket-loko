/**
 * Event-style ribbon: title + subtitle, ticket-style with inward notches and arc.
 */
const ticketClipId = "hero-ribbon-ticket-clip";

export function HeroRibbon() {
  return (
    <div className="ribbon-shine w-full max-w-md mx-auto mb-3">
      <svg
        aria-hidden
        className="absolute w-0 h-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={ticketClipId} clipPathUnits="objectBoundingBox">
            {/* Inspired by `ticket-simple-svgrepo-com.svg`: rounded corners + smooth inward notches */}
            <path d="M 0.10,0 H 0.90 A 0.10,0.10 0 0 1 1,0.10 V 0.39 A 0.13,0.13 0 0 1 0.93,0.50 A 0.13,0.13 0 0 1 1,0.61 V 0.90 A 0.10,0.10 0 0 1 0.90,1 H 0.10 A 0.10,0.10 0 0 1 0,0.90 V 0.61 A 0.13,0.13 0 0 1 0.07,0.50 A 0.13,0.13 0 0 1 0,0.39 V 0.10 A 0.10,0.10 0 0 1 0.10,0 Z" />
          </clipPath>
        </defs>
      </svg>
      <div
        className="hero-ribbon-ticket bg-gradient-to-r from-amber-600 via-brand-yellow to-amber-600 text-red-900 font-black text-center py-2.5 px-4 border-2 border-amber-700/60 shadow-lg"
        style={{ clipPath: `url(#${ticketClipId})` }}
      >
        <p className="text-sm sm:text-base uppercase tracking-wide drop-shadow-sm">
          Ofertas imperdíveis
        </p>
        <p className="text-[10px] sm:text-xs font-bold text-red-800 mt-0.5">
          Monte seu orçamento e consulte condições no WhatsApp
        </p>
      </div>
    </div>
  );
}
