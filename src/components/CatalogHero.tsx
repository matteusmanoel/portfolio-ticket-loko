import { Link } from "react-router-dom";
import {
  List,
  LayoutGrid,
  TicketPercent,
  Settings,
  Search,
} from "lucide-react";
import { FilterChips } from "@/components/FilterChips";
// import { HeroRibbon } from "@/components/HeroRibbon";
import type { Category } from "@/types/catalog";

/** Decorative percentages (subtle, blurred) — hero only */
const DECO_PERCENTS = ["10%", "20%", "15%", "25%", "30%", "20%"];

interface CatalogHeroProps {
  compact?: boolean;
  filter: Category;
  onFilter: (c: Category) => void;
  categories: Category[];
  search: string;
  onSearch: (v: string) => void;
  viewMode: "list" | "grid";
  onViewMode: (v: "list" | "grid") => void;
  cartCount: number;
  onOpenCart: () => void;
}

export function CatalogHero({
  compact = false,
  filter,
  onFilter,
  categories,
  search,
  onSearch,
  viewMode,
  onViewMode,
  cartCount,
  onOpenCart,
}: CatalogHeroProps) {
  return (
    <header
      className={`hero-header hero-radial rounded-b-[3rem] shadow-lg sticky top-0 z-20 border-b-8 border-brand-red lg:rounded-none relative overflow-hidden ${compact ? "hero-header--compact" : ""}`}
    >
      {/* Textura sutil (CSS-only) — hidden when compact */}
      <div
        className={`absolute inset-0 opacity-[0.10] hero-texture pointer-events-none ${compact ? "opacity-0" : ""}`}
        aria-hidden
      />
      {/* Decorative percentages — hidden when compact */}
      {!compact && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden
        >
          {DECO_PERCENTS.map((pct, i) => (
            <span
              key={`${pct}-${i}`}
              className="absolute text-brand-yellow/40 font-black text-lg sm:text-xl select-none"
              style={{
                filter: "blur(2px)",
                top: `${8 + (i % 3) * 22}%`,
                left: `${5 + (i % 4) * 28}%`,
                transform: `rotate(${-6 + (i % 5) * 3}deg)`,
              }}
            >
              {pct}
            </span>
          ))}
        </div>
      )}

      <div
        className="hero-header__top flex flex-col items-center text-center relative"
        aria-hidden={compact}
      >
        <div className="absolute left-0 top-0 flex items-center z-10">
          <Link
            to="/admin"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            aria-label="Admin"
            title={
              import.meta.env.DEV
                ? "Admin (dev: use ?devAdmin=1 na URL para acessar sem login)"
                : "Admin"
            }
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute right-0 top-0 flex items-center z-10">
          <button
            type="button"
            onClick={onOpenCart}
            className="cta-jackpot cta-shine flex items-center justify-center gap-1.5 bg-brand-red text-white px-4 py-2.5 rounded-xl shadow-lg border-2 border-red-800/30 hover:bg-brand-red-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red"
            aria-label="Ver meu orçamento"
          >
            <TicketPercent className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="bg-white text-brand-red min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div className="hero-header__brand px-6 py-3 mb-2">
          <img
            src="/Logo%20TL.png"
            alt="Ticket Loko"
            className="hero-header__logo h-20 sm:h-28 w-auto max-w-[320px] sm:max-w-[400px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            decoding="async"
          />
        </div>
      </div>

      <div className="w-full max-w-[980px] mx-auto hero-header__chips">
        <FilterChips
          current={filter}
          onSelect={onFilter}
          categories={categories}
        />
      </div>
      <div className="hero-header__search px-4 lg:px-0 pb-2 flex gap-2 items-center max-w-[980px] w-full mx-auto">
        <div className="flex-1 relative">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="search-arcade w-full pl-4 pr-10 py-2.5 lg:py-3 lg:text-base rounded-2xl border-2 border-red-200 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 bg-white/90"
            aria-label="Buscar por nome ou descrição"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red pointer-events-none" />
        </div>
        <div className="flex rounded-xl border-2 border-red-200 overflow-hidden bg-white/90 shadow-inner arcade-toggle">
          <button
            type="button"
            onClick={() => onViewMode("list")}
            aria-label="Visualização em lista"
            aria-pressed={viewMode === "list"}
            className={`p-2.5 lg:p-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${viewMode === "list" ? "bg-brand-red text-white shadow-inner" : "text-gray-500 hover:bg-brand-yellow-soft"}`}
          >
            <List className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          <button
            type="button"
            onClick={() => onViewMode("grid")}
            aria-label="Visualização em grade"
            aria-pressed={viewMode === "grid"}
            className={`p-2.5 lg:p-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${viewMode === "grid" ? "bg-brand-red text-white shadow-inner" : "text-gray-500 hover:bg-brand-yellow-soft"}`}
          >
            <LayoutGrid className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
