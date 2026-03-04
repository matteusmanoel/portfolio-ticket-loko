import type { CartItem } from '@/types/catalog'

export function buildRequestMessage(items: CartItem[], groupDetails: string): string {
  const lines: string[] = [
    'Olá!',
    '',
    'Adorei o catálogo! Poderia me enviar orçamento para estes itens?',
    '',
  ]
  items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.name}`)
  })
  const groupText = groupDetails.trim() || 'Não informado.'
  lines.push('')
  lines.push('*Composição do grupo:*')
  lines.push(groupText)
  lines.push('')
  lines.push('Desde já agradeço! Fico no aguardo do retorno.')
  return lines.join('\n').trim()
}

export function getWhatsAppUrl(phoneE164: string, text: string): string {
  const encoded = encodeURIComponent(text)
  const digits = phoneE164.replace(/\D/g, '')
  // wa.me works on mobile and desktop; use it for consistency
  return `https://wa.me/${digits}?text=${encoded}`
}
