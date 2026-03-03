export interface VendorInfo {
  slug: string
  wpp: string
  isValid: boolean
}

const E164_MIN = 10
const E164_MAX = 15

/**
 * Validates E.164-like phone (digits only, plausible length).
 */
export function validateWpp(wpp: string): boolean {
  const digits = wpp.replace(/\D/g, '')
  return digits.length >= E164_MIN && digits.length <= E164_MAX
}

/**
 * Normalizes phone to digits only for wa.me.
 */
export function normalizeWpp(wpp: string): string {
  return wpp.replace(/\D/g, '')
}

/**
 * Reads vendor from URL query: ?wpp=<phone> or ?v=<slug>&wpp=<phone>
 * If only wpp is present, slug defaults to "vendedor".
 */
export function getVendorFromQuery(): VendorInfo | null {
  const params = new URLSearchParams(window.location.search)
  const wppRaw = params.get('wpp')?.trim() ?? ''
  if (!wppRaw) return null
  const wpp = normalizeWpp(wppRaw)
  const isValid = validateWpp(wpp)
  const slug = params.get('v')?.trim() || 'vendedor'
  return { slug, wpp, isValid }
}

const STORAGE_KEY = 'tl_vendor'
const TTL_DAYS = 30

interface StoredVendorPayload extends VendorInfo {
  storedAt: number
}

export function getStoredVendor(): VendorInfo | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredVendorPayload
    const storedAt = parsed.storedAt
    if (typeof storedAt !== 'number') return null
    const expiresAt = storedAt + TTL_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() > expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    if (!parsed.wpp || !validateWpp(parsed.wpp)) return null
    return {
      slug: parsed.slug || 'vendedor',
      wpp: parsed.wpp,
      isValid: true,
    }
  } catch {
    // ignore
  }
  return null
}

export function setStoredVendor(vendor: VendorInfo | null): void {
  if (typeof window === 'undefined') return
  if (!vendor) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  const payload: StoredVendorPayload = {
    ...vendor,
    storedAt: Date.now(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
