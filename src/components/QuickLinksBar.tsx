import { MapPin, Instagram, Youtube } from "lucide-react";

const quickLinkBase =
  "inline-flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 px-2 rounded-xl border border-transparent text-brand-red hover:bg-red-50 hover:border-red-200 active:bg-red-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2";

interface QuickLinksBarProps {
  onOpenPickup: () => void;
  showPickup: boolean;
  variant: "mobile" | "desktop";
}

export function QuickLinksBar({
  onOpenPickup,
  showPickup,
  variant,
}: QuickLinksBarProps) {
  const isDesktop = variant === "desktop";
  const labelClass =
    "text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600";
  const iconClass = "w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0";

  return (
    <>
      <a
        href="https://instagram.com/ticketloko"
        target="_blank"
        rel="noopener noreferrer"
        className={
          isDesktop
            ? `${quickLinkBase} flex-1 min-w-0 max-w-[120px]`
            : quickLinkBase
        }
        aria-label="Abrir Instagram do Ticket Loko"
      >
        <Instagram className={iconClass} strokeWidth={2} />
        <span className={`${labelClass} ${isDesktop ? "truncate w-full text-center" : ""}`}>
          Instagram
        </span>
      </a>
      <a
        href="https://youtube.com/@TicketLoko"
        target="_blank"
        rel="noopener noreferrer"
        className={
          isDesktop
            ? `${quickLinkBase} flex-1 min-w-0 max-w-[120px]`
            : quickLinkBase
        }
        aria-label="Abrir YouTube do Ticket Loko"
      >
        <Youtube className={iconClass} strokeWidth={2} />
        <span className={`${labelClass} ${isDesktop ? "truncate w-full text-center" : ""}`}>
          YouTube
        </span>
      </a>
      {showPickup && (
        <button
          type="button"
          onClick={onOpenPickup}
          className={
            isDesktop
              ? `${quickLinkBase} flex-1 min-w-0 max-w-[120px]`
              : `${quickLinkBase} flex-1 min-w-0 max-w-[80px] sm:max-w-none`
          }
          aria-label="Ver pontos de retirada e onde nos encontrar"
        >
          <MapPin className={iconClass} strokeWidth={2.5} />
          <span className={`${labelClass} truncate w-full text-center`}>
            Onde retirar
          </span>
        </button>
      )}
    </>
  );
}
