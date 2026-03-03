import type { CartItem } from '@/types/catalog'

export function buildRequestMessage(items: CartItem[], groupDetails: string): string {
  const lines: string[] = [
    'Olá! 👋',
    '',
    'Vi o catálogo e gostaria de solicitar orçamento para os seguintes itens: 🎟️',
    '',
  ]
  items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.name}`)
  })
  lines.push('')
  lines.push('*Composição do grupo:* 👥')
  lines.push(groupDetails.trim() || 'Não informado.')
  lines.push('')
  lines.push('Aguardo retorno. Obrigado(a)! 🙏')
  return lines.join('\n').trim()
}

export function getWhatsAppUrl(phoneE164: string, text: string): string {
  const encoded = encodeURIComponent(text)
  const digits = phoneE164.replace(/\D/g, '')
  // wa.me works on mobile and desktop; use it for consistency
  return `https://wa.me/${digits}?text=${encoded}`
}
