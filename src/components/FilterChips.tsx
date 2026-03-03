import { LayoutGrid, Ticket, Utensils, Bus } from 'lucide-react'
import type { Category } from '@/types/catalog'

const LABELS: Record<string, string> = {
  Todos: 'Todos',
  Ingressos: 'Ingressos',
  Transportes: 'Transportes',
  Restaurantes: 'Restaurantes',
}

const CAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Todos: LayoutGrid,
  Ingressos: Ticket,
  Transportes: Bus,
  Restaurantes: Utensils,
}

interface FilterChipsProps {
  current: string
  onSelect: (category: Category) => void
  categories: Category[]
}

export function FilterChips({ current, onSelect, categories }: FilterChipsProps) {
  return (
    <div className="filter-chips-wrap relative pb-4 px-4">
      <div
        className="filter-chips-scroll flex gap-2 overflow-x-auto hide-scrollbar flex-nowrap scroll-smooth snap-x snap-mandatory"
        role="tablist"
        aria-label="Filtrar por categoria"
      >
        {categories.map((cat) => {
          const Icon = CAT_ICONS[cat]
          const isActive = current === cat
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Categoria: ${LABELS[cat] ?? cat}`}
              onClick={() => onSelect(cat)}
              className={`filter-btn snap-start px-3 py-2.5 lg:px-5 lg:py-3 rounded-2xl text-[10px] lg:text-sm font-black uppercase whitespace-nowrap transition-all flex-shrink-0 flex items-center justify-center gap-1.5 border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red ${
                isActive
                  ? 'active bg-brand-red text-white border-amber-600/60'
                  : 'bg-white text-brand-red border-red-200 hover:border-red-300'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" aria-hidden />}
              <span>{LABELS[cat] ?? cat}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
