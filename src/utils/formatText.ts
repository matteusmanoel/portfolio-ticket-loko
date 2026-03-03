/**
 * Converts WhatsApp-style markdown (*bold*, _italic_, ~strike~) to HTML for display.
 */
export function formatWhatsAppText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/\*(.*?)\*/g, '<b>$1</b>')
    .replace(/_(.*?)_/g, '<i>$1</i>')
    .replace(/~(.*?)~/g, '<strike>$1</strike>')
}

/** Plain text for list/preview (strip markdown). */
export function plainText(text: string | null | undefined): string {
  if (!text) return ''
  return text.replace(/[*_~]/g, '')
}
