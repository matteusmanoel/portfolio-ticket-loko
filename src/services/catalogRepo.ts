import { collection, onSnapshot, Timestamp, Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import type { Attraction } from '@/types/catalog'

const COL = 'attractions_v1'

function fromDoc(id: string, data: Record<string, unknown>): Attraction {
  const updatedAt = data.updatedAt
  const rawImages = data.images
  const imagesArray = Array.isArray(rawImages)
    ? (rawImages as string[]).filter((u): u is string => typeof u === 'string')
    : undefined
  const rawCategory = (data.category as string) ?? ''
  return {
    id,
    name: (data.name as string) ?? '',
    category: String(rawCategory).trim().normalize('NFKC'),
    desc: data.desc as string | undefined,
    rules: data.rules as string | undefined,
    img: data.img as string | undefined,
    images: imagesArray?.length ? imagesArray : undefined,
    video: data.video as string | undefined,
    open: data.open as string | undefined,
    close: data.close as string | undefined,
    active: data.active !== false,
    order: typeof data.order === 'number' ? data.order : undefined,
    updatedAt: updatedAt instanceof Timestamp ? updatedAt.toMillis() : updatedAt,
  }
}

function sortItems(items: Attraction[]): Attraction[] {
  return [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

export type CatalogState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; items: Attraction[] }

export function subscribeCatalog(onState: (state: CatalogState) => void): Unsubscribe {
  onState({ status: 'loading' })
  const colRef = collection(db, COL)
  return onSnapshot(
    colRef,
    (snap) => {
      const items = sortItems(snap.docs.map((d) => fromDoc(d.id, d.data())))
      onState({ status: 'ready', items })
    },
    (err) => {
      onState({ status: 'error', error: err instanceof Error ? err : new Error(String(err)) })
    }
  )
}
