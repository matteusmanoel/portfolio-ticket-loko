# Mapeamento: protótipo → novo app

| Protótipo (index.html) | Novo app | Ação |
|------------------------|----------|------|
| Lista de itens (render) | `CatalogPage` + `CatalogCard` + `useCatalog` | Manter |
| Filtros por categoria (setFilter, chips) | `FilterChips` + estado em catalog | Manter |
| Modal de detalhes do item | `ItemDetailModal` | Manter; melhorar acessibilidade (ESC, focus trap) |
| Adicionar ao orçamento | `addToCart` em cart store | Manter |
| Footer "Ver Meu Orçamento" + contador | `CartFooter` + cart store | Manter |
| Modal "Meu Orçamento" (roteiro) | `CartDrawer` / `CartModal` | Manter |
| Textarea "Informações do Grupo" | Campo no CartDrawer | Manter |
| Gerar PDF do Orçamento | **Solicitar Orçamento** (WhatsApp) | Substituir |
| Painel Admin (senha + CRUD) | Removido do frontend | Remover; uso Firestore Console (A1) |
| Bloqueio clique direito / F12 | Removido | Remover (UX e acessibilidade) |
| user-select: none em body | Remover | Remover |
| Auth anônimo Firebase | Manter só para leitura (regras restritas) | Ajustar regras |

## Dados
- Coleção: `attractions_v1` (mantida).
- Orçamento: `localStorage` key `tl_roteiro` (mantida para compatibilidade opcional) ou nova key `tl_cart`.

## Novos no app
- Link por vendedor: `?v=<slug>&wpp=<e164>`.
- Busca por texto (nome/descrição).
- Skeleton loading, empty states, tratamento de erro.
- Mensagem formatada para WhatsApp ao solicitar orçamento.
