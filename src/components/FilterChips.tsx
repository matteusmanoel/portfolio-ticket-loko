import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Ticket,
  Utensils,
  Bus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Category } from "@/types/catalog";

const LABELS: Record<string, string> = {
  Todos: "Todos",
  Ingressos: "Ingressos",
  Transportes: "Transportes",
  Restaurantes: "Restaurantes",
};

const CAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Todos: LayoutGrid,
  Ingressos: Ticket,
  Transportes: Bus,
  Restaurantes: Utensils,
};

const SCROLL_STEP = 160;

interface FilterChipsProps {
  current: string;
  onSelect: (category: Category) => void;
  categories: Category[];
}

export function FilterChips({
  current,
  onSelect,
  categories,
}: FilterChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setHasOverflow(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories.length]);

  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [current]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  };

  return (
    <div className="filter-chips-wrap relative pb-4 px-6">
      {hasOverflow && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-4 z-10 w-8 flex items-center justify-start bg-gradient-to-r from-brand-yellow/95 to-transparent pl-1 text-brand-red hover:text-red-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-yellow rounded-l-xl"
          aria-label="Rolar categorias para a esquerda"
        >
          <ChevronLeft className="w-5 h-5 flex-shrink-0 drop-shadow-sm" />
        </button>
      )}
      <motion.div
        ref={scrollRef}
        initial={false}
        className="filter-chips-scroll flex gap-1.5 overflow-x-auto hide-scrollbar flex-nowrap scroll-smooth snap-x snap-mandatory"
        role="tablist"
        aria-label="Filtrar por categoria"
      >
        {categories.map((cat) => {
          const Icon = CAT_ICONS[cat];
          const isActive = current === cat;
          return (
            <button
              key={cat}
              ref={isActive ? activeButtonRef : undefined}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Categoria: ${LABELS[cat] ?? cat}`}
              onClick={() => onSelect(cat)}
              className={`filter-btn snap-start px-2.5 py-2 lg:px-5 lg:py-3 rounded-2xl text-[10px] lg:text-sm font-black uppercase whitespace-nowrap transition-all flex-shrink-0 flex items-center justify-center gap-1.5 border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red ${
                isActive
                  ? "active bg-brand-red text-white border-amber-600/60"
                  : "bg-white text-brand-red border-red-200 hover:border-red-300"
              }`}
            >
              {Icon && (
                <Icon
                  className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0"
                  aria-hidden
                />
              )}
              <span>{LABELS[cat] ?? cat}</span>
            </button>
          );
        })}
      </motion.div>
      {hasOverflow && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-4 z-10 w-8 flex items-center justify-end bg-gradient-to-l from-brand-yellow/95 to-transparent pr-1 text-brand-red hover:text-red-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-yellow rounded-r-xl"
          aria-label="Rolar categorias para a direita"
        >
          <ChevronRight className="w-5 h-5 flex-shrink-0 drop-shadow-sm" />
        </button>
      )}
    </div>
  );
}
