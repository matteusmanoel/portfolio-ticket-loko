import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { Modal } from '@/components/Modal'

interface ExpandableTextareaProps {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  label?: string
  id?: string
  className?: string
  labelClassName?: string
  /** Optional title for the expand modal */
  expandModalTitle?: string
  /** Minimal layout with prominent expand button in top-right */
  compact?: boolean
}

export function ExpandableTextarea({
  value,
  onChange,
  rows = 3,
  placeholder,
  label,
  id,
  className = '',
  labelClassName = 'block text-xs font-bold text-gray-500 uppercase mb-1',
  expandModalTitle = 'Visualizar / editar texto',
  compact = false,
}: ExpandableTextareaProps) {
  const [expandOpen, setExpandOpen] = useState(false)

  return (
    <div className={`relative ${compact ? 'rounded-lg border border-gray-200 bg-gray-50/80' : ''}`}>
      {compact ? (
        <div className="flex items-center justify-between gap-2 px-2 pt-1.5 pb-0">
          <label htmlFor={id} className="text-[10px] font-bold uppercase text-gray-400">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setExpandOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-brand-red hover:bg-red-50 border border-red-200/80 text-[10px] font-bold uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1 shrink-0"
            aria-label="Expandir para editar"
            title="Expandir para editar"
          >
            <Maximize2 className="w-3.5 h-3.5 flex-shrink-0" />
            Expandir
          </button>
        </div>
      ) : (
        label && (
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        )
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={compact ? 2 : rows}
        placeholder={placeholder}
        className={`w-full border-gray-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1 ${compact ? 'border-0 bg-transparent text-sm text-gray-700 py-1.5 px-3 pb-2 resize-none placeholder:text-gray-400' : `border-2 px-4 py-2 pt-8 pr-9 ${className}`}`}
      />
      {!compact && (
        <button
          type="button"
          onClick={() => setExpandOpen(true)}
          className="absolute top-1.5 right-1.5 p-1 rounded text-gray-400 hover:text-brand-red hover:bg-red-50/50 transition-colors"
          aria-label="Expandir para visualização"
          title="Expandir para visualização"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}
      <Modal
        open={expandOpen}
        onClose={() => setExpandOpen(false)}
        title={expandModalTitle}
        variant="center"
        size="lg"
      >
        <div className="p-6 space-y-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={14}
            placeholder={placeholder}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm resize-y min-h-[280px]"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setExpandOpen(false)}
              className="px-6 py-2.5 rounded-xl font-bold bg-brand-red text-white hover:bg-brand-red-hover"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
