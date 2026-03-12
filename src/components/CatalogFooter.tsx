import { TicketPercent } from "lucide-react";
import { PICKUP_POINTS } from "@/data/pickupPoints";
import { QuickLinksBar } from "@/components/QuickLinksBar";

interface CatalogFooterProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenPickup: () => void;
}

export function CatalogFooter({
  cartCount,
  onOpenCart,
  onOpenPickup,
}: CatalogFooterProps) {
  const hasPickupPoints = PICKUP_POINTS.length > 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto flex border-t border-red-200 bg-white/95 backdrop-blur-md">
      <div className="flex-1 flex items-stretch justify-center gap-0.5 sm:gap-1 py-1.5 sm:py-2 pl-2 pr-1 sm:pl-3 sm:pr-2 min-w-0">
        <QuickLinksBar
          onOpenPickup={onOpenPickup}
          showPickup={hasPickupPoints}
          variant="mobile"
        />
      </div>
      <div className="flex-shrink-0 w-px bg-red-200 self-stretch my-1" aria-hidden />
      <div className="flex-1 flex items-center justify-center py-1.5 sm:py-2 pl-1.5 pr-2 sm:pl-2 sm:pr-3 min-w-0">
        <button
          type="button"
          onClick={onOpenCart}
          className="cta-jackpot cta-shine flex items-center justify-center gap-1.5 sm:gap-2 bg-brand-red text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl font-black uppercase italic shadow-lg border-2 border-red-800/30 hover:bg-brand-red-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red flex-1 min-w-0 max-w-[180px] sm:max-w-[200px] text-xs sm:text-sm"
          aria-label="Meus Tickets"
        >
          <TicketPercent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">Meus Tickets</span>
          {cartCount > 0 && (
            <span className="bg-white text-brand-red min-w-[1.125rem] h-4 sm:min-w-[1.25rem] sm:h-5 px-1 rounded-full text-[10px] sm:text-xs font-black flex items-center justify-center flex-shrink-0">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </footer>
  );
}
