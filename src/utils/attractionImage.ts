import type { Attraction } from '@/types/catalog'

function applyCloudinaryTransform(url: string, maxWidth: number): string {
  if (!url) return url
  if (!url.includes('res.cloudinary.com')) return url

  const marker = '/image/upload/'
  const idx = url.indexOf(marker)
  if (idx === -1) return url

  const before = url.slice(0, idx + marker.length)
  const after = url.slice(idx + marker.length)

  // If there's already a transform segment, do nothing (avoid double transforms).
  // Common transform segment contains commas and no file extension yet.
  const firstSeg = after.split('/')[0] ?? ''
  const looksLikeTransform = firstSeg.includes(',') || firstSeg.startsWith('c_') || firstSeg.startsWith('w_')
  if (looksLikeTransform) return url

  const t = `f_auto,q_auto,dpr_auto,c_limit,w_${Math.max(160, Math.min(2000, Math.round(maxWidth)))}`
  return `${before}${t}/${after}`
}

/**
 * Returns the best display image URL for an attraction (first of images[] or img).
 */
export function getDisplayImage(item: Attraction, maxWidth = 800): string | undefined {
  const raw = item.images?.length ? item.images[0] : item.img
  if (!raw) return raw
  return applyCloudinaryTransform(raw, maxWidth)
}

/**
 * Returns all image URLs for an attraction (images[] if present, otherwise [img] if set).
 */
export function getAllImages(item: Attraction, maxWidth = 1400): string[] {
  if (item.images?.length) return item.images.map((u) => applyCloudinaryTransform(u, maxWidth))
  if (item.img) return [applyCloudinaryTransform(item.img, maxWidth)]
  return []
}
