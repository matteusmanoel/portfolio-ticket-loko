export type Category = 'Ingressos' | 'Transportes' | 'Restaurantes' | string

export interface Attraction {
  id: string
  name: string
  category: Category
  desc?: string
  rules?: string
  img?: string
  /** Multiple photo URLs (e.g. from Storage). First used as cover when img not set. */
  images?: string[]
  video?: string
  open?: string
  close?: string
  active?: boolean
  order?: number
  updatedAt?: unknown
}

export interface CartItem {
  id: string
  name: string
}

export const CATEGORIES: Category[] = ['Todos', 'Ingressos', 'Transportes', 'Restaurantes']

const CUSTOM_CATEGORIES_KEY = 'tl_custom_categories'

/** Returns custom categories from localStorage for use in catalog filter. */
export function getCustomCategoriesForFilter(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Normalize category for consistent comparison (trim + NFKC). */
export function normalizeCategory(c: string): string {
  return String(c ?? '').trim().normalize('NFKC')
}
