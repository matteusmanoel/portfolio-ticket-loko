import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Attraction } from '@/types/catalog'

const COL = 'attractions_v1'

export type AttractionPayload = Omit<
  Partial<Attraction>,
  'id' | 'updatedAt'
> & {
  name: string
  category: string
  active?: boolean
}

export async function createItem(payload: AttractionPayload): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    name: payload.name,
    category: payload.category,
    desc: payload.desc ?? '',
    rules: payload.rules ?? '',
    img: payload.img ?? '',
    images: payload.images ?? [],
    video: payload.video ?? '',
    open: payload.open ?? '',
    close: payload.close ?? '',
    active: payload.active !== false,
    order: payload.order,
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateItem(
  id: string,
  payload: Partial<AttractionPayload>
): Promise<void> {
  const data: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  }
  if (payload.name !== undefined) data.name = payload.name
  if (payload.category !== undefined) data.category = payload.category
  if (payload.desc !== undefined) data.desc = payload.desc
  if (payload.rules !== undefined) data.rules = payload.rules
  if (payload.img !== undefined) data.img = payload.img
  if (payload.images !== undefined) data.images = payload.images
  if (payload.video !== undefined) data.video = payload.video
  if (payload.open !== undefined) data.open = payload.open
  if (payload.close !== undefined) data.close = payload.close
  if (payload.active !== undefined) data.active = payload.active
  if (payload.order !== undefined) data.order = payload.order
  await setDoc(doc(db, COL, id), data, { merge: true })
}

export async function deleteItem(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}
