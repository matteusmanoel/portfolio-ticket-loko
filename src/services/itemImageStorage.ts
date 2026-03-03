import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

const ITEMS_PREFIX = 'items'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
  | string
  | undefined
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
  | string
  | undefined

function hasCloudinaryConfig() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)
}

async function uploadItemImageToCloudinary(itemId: string, file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary não configurado (VITE_CLOUDINARY_*)')
  }

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  form.append('folder', `${ITEMS_PREFIX}/${itemId}`)
  form.append('public_id', crypto.randomUUID())

  const resp = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/image/upload`,
    { method: 'POST', body: form }
  )

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`Falha no upload (Cloudinary): ${resp.status} ${text}`.trim())
  }

  const json = (await resp.json()) as { secure_url?: unknown }
  if (typeof json.secure_url !== 'string' || !json.secure_url) {
    throw new Error('Falha no upload (Cloudinary): resposta sem secure_url')
  }
  return json.secure_url
}

async function uploadItemImageToFirebase(itemId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${ITEMS_PREFIX}/${itemId}/${crypto.randomUUID()}.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytesResumable(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Upload a file and return a public URL.
 *
 * - If Cloudinary env vars are set, uses Cloudinary (unsigned upload preset).
 * - Otherwise falls back to Firebase Storage.
 */
export async function uploadItemImage(itemId: string, file: File): Promise<string> {
  if (hasCloudinaryConfig()) return uploadItemImageToCloudinary(itemId, file)
  return uploadItemImageToFirebase(itemId, file)
}
