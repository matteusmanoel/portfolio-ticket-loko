import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Link2, Search } from 'lucide-react'
import { logout } from '@/services/adminAuth'
import { subscribeCatalog } from '@/services/catalogRepo'
import { createItem, updateItem, deleteItem } from '@/services/adminCatalogRepo'
import { uploadItemImage } from '@/services/itemImageStorage'
import { normalizeCategory, type Attraction, type Category } from '@/types/catalog'
import { normalizeWpp, validateWpp } from '@/features/vendor/vendorFromQuery'
import { Modal } from '@/components/Modal'
import { ExpandableTextarea } from '@/components/ExpandableTextarea'
import { Snackbar, type SnackbarVariant } from '@/components/Snackbar'

const CATEGORY_OPTIONS: Category[] = ['Ingressos', 'Transportes', 'Restaurantes']
const CUSTOM_CATEGORIES_KEY = 'tl_custom_categories'

function getStoredCustomCategories(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function VendorLinkGeneratorModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [wppRaw, setWppRaw] = useState('')
  const [copied, setCopied] = useState(false)
  const digits = normalizeWpp(wppRaw)
  const isValid = validateWpp(wppRaw)
  const link =
    typeof window !== 'undefined' && digits
      ? `${window.location.origin}/?wpp=${digits}`
      : ''

  const copyLink = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = link
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } finally {
        document.body.removeChild(ta)
      }
    }
  }

  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title="Gerar link do vendedor" variant="center" size="md">
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Digite o WhatsApp do vendedor. O link gerado é o que cada vendedor encaminha ao cliente para persistir o contato e receber o orçamento no WhatsApp.
        </p>
        <label className="block">
          <span className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</span>
          <input
            type="tel"
            value={wppRaw}
            onChange={(e) => setWppRaw(e.target.value)}
            placeholder="5545999999999 ou (45) 99999-9999"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
          />
        </label>
        {link && (
          <p className="text-xs text-gray-600 break-all font-mono bg-gray-50 p-3 rounded-lg border border-gray-200">
            {link}
          </p>
        )}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={copyLink}
            disabled={!isValid || !link}
            className="flex-1 py-3 rounded-xl font-bold bg-brand-red text-white disabled:opacity-50 hover:bg-brand-red-hover"
          >
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function AdminPage() {
  const [items, setItems] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [vendorLinkModalOpen, setVendorLinkModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Attraction | null>(null)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<SnackbarVariant>('added')
  const [customCategories, setCustomCategories] = useState<string[]>(getStoredCustomCategories)

  const persistCustomCategories = (next: string[]) => {
    setCustomCategories(next)
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }
  const handleAddCustomCategory = (name: string): boolean => {
    const trimmed = name.trim()
    if (!trimmed) return false
    const normalized = normalizeCategory(trimmed)
    const exists =
      CATEGORY_OPTIONS.some((c) => normalizeCategory(c) === normalized) ||
      customCategories.some((c) => normalizeCategory(c) === normalized)
    if (exists) return false
    const next = [...customCategories, trimmed]
    persistCustomCategories(next)
    return true
  }

  useEffect(() => {
    const unsub = subscribeCatalog((state) => {
      setLoading(state.status === 'loading')
      if (state.status === 'ready') setItems(state.items)
    })
    return unsub
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setFormOpen(true)
  }
  const openEdit = (item: Attraction) => {
    setEditingId(item.id)
    setFormOpen(true)
  }
  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
  }

  const searchLower = search.trim().toLowerCase()
  const itemsFiltered =
    !searchLower
      ? items
      : items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchLower) ||
            normalizeCategory(item.category).toLowerCase().includes(searchLower)
        )

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteItem(deleteTarget.id)
      .then(() => {
        setDeleteTarget(null)
        setToastMessage('Item excluído.')
        setToastVariant('removed')
        setToastOpen(true)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao excluir')
      )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-brand-red font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao catálogo
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sair
        </button>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4 mt-4">
          <h1 className="font-black text-xl text-gray-800">Admin – Catálogo</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVendorLinkModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:border-brand-red/50 hover:text-brand-red text-sm"
            >
              <Link2 className="w-4 h-4" />
              Gerar link do vendedor
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              Novo item
            </button>
          </div>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou categoria..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-brand-red/50"
            aria-label="Buscar cadastro"
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <ul className="space-y-2">
            {itemsFiltered.map((item) => (
              <li key={item.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openEdit(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openEdit(item)
                    }
                  }}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-200 cursor-pointer transition-all hover:border-brand-red/40 hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                >
                  <span
                    className={`flex-1 font-medium truncate ${
                      item.active === false ? 'text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-gray-600 uppercase bg-gray-100 px-2 py-1 rounded-lg">
                    {item.category}
                  </span>
                  {item.active === false && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-1 rounded">
                      Oculto
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEdit(item)
                    }}
                    className="p-2 text-gray-500 hover:text-brand-red rounded-lg hover:bg-red-50"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteTarget(item)
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    aria-label="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      {formOpen && (
        <AdminItemForm
          items={items}
          editingId={editingId}
          onClose={closeForm}
          onSaved={() => {
            closeForm()
            setToastMessage('Item salvo.')
            setToastVariant('added')
            setToastOpen(true)
          }}
          onError={setError}
          saving={saving}
          setSaving={setSaving}
          onShowToast={(message, variant) => {
            setToastMessage(message)
            setToastVariant(variant)
            setToastOpen(true)
          }}
          customCategories={customCategories}
          onAddCustomCategory={handleAddCustomCategory}
        />
      )}
      <VendorLinkGeneratorModal
        open={vendorLinkModalOpen}
        onClose={() => setVendorLinkModalOpen(false)}
      />
      {deleteTarget && (
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Confirmar exclusão"
          variant="center"
          size="md"
        >
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              Deseja realmente excluir o item <strong>"{deleteTarget.name}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      )}
      <Snackbar
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        variant={toastVariant}
        duration={3000}
      />
    </div>
  )
}

interface AdminItemFormProps {
  items: Attraction[]
  editingId: string | null
  onClose: () => void
  onSaved: () => void
  onError: (msg: string | null) => void
  saving: boolean
  setSaving: (v: boolean) => void
  onShowToast?: (message: string, variant: SnackbarVariant) => void
  customCategories: string[]
  onAddCustomCategory: (name: string) => boolean
}

type ImageEntry = { type: 'url'; url: string } | { type: 'file'; file: File; id: string }

function AdminItemForm({
  items,
  editingId,
  onClose,
  onSaved,
  onError,
  saving,
  setSaving,
  onShowToast,
  customCategories,
  onAddCustomCategory,
}: AdminItemFormProps) {
  const editing = items.find((i) => i.id === editingId)
  const [name, setName] = useState(editing?.name ?? '')
  const [category, setCategory] = useState<Category>(editing?.category ?? 'Ingressos')
  const [desc, setDesc] = useState(editing?.desc ?? '')
  const [rules, setRules] = useState(editing?.rules ?? '')
  const [open, setOpen] = useState(editing?.open ?? '')
  const [close, setClose] = useState(editing?.close ?? '')
  const [video, setVideo] = useState(editing?.video ?? '')
  const [img, setImg] = useState(editing?.img ?? '')
  const [active, setActive] = useState(editing?.active !== false)
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>(() =>
    (editing?.images ?? []).map((url) => ({ type: 'url' as const, url }))
  )
  const [imageUrlToAdd, setImageUrlToAdd] = useState('')
  const [imageDeleteTarget, setImageDeleteTarget] = useState<{ index: number } | null>(null)
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const isValidUrlToAdd = (() => {
    const u = imageUrlToAdd.trim()
    if (!u) return false
    try {
      new URL(u)
      return true
    } catch {
      return false
    }
  })()

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setCategory(editing.category as Category)
      setDesc(editing.desc ?? '')
      setRules(editing.rules ?? '')
      setOpen(editing.open ?? '')
      setClose(editing.close ?? '')
      setVideo(editing.video ?? '')
      setImg(editing.img ?? '')
      setActive(editing.active !== false)
      setImageEntries((editing.images ?? []).map((url) => ({ type: 'url' as const, url })))
    } else {
      setImageEntries([])
    }
  }, [editing])

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const newEntries: ImageEntry[] = Array.from(files).map((file) => ({
      type: 'file',
      file,
      id: crypto.randomUUID(),
    }))
    setImageEntries((prev) => [...prev, ...newEntries])
  }
  const addUrlToGallery = () => {
    const url = imageUrlToAdd.trim()
    if (!url) return
    try {
      new URL(url)
      setImageEntries((prev) => [...prev, { type: 'url', url }])
      setImageUrlToAdd('')
    } catch {
      onError('URL inválida.')
    }
  }
  const removeImageAt = (index: number) => {
    setImageEntries((prev) => prev.filter((_, i) => i !== index))
  }
  const confirmRemoveImage = () => {
    if (imageDeleteTarget != null) {
      removeImageAt(imageDeleteTarget.index)
      setImageDeleteTarget(null)
      onShowToast?.('Foto removida.', 'removed')
    }
  }
  const handleCreateCategory = () => {
    const trimmed = newCategoryName.trim()
    if (!trimmed) return
    const added = onAddCustomCategory(trimmed)
    if (added) {
      setCategory(trimmed)
      setNewCategoryName('')
      setNewCategoryModalOpen(false)
    } else {
      onError('Já existe uma categoria com esse nome.')
    }
  }
  const moveImage = (index: number, delta: number) => {
    const next = index + delta
    if (next < 0 || next >= imageEntries.length) return
    setImageEntries((prev) => {
      const copy = [...prev]
      ;[copy[index], copy[next]] = [copy[next], copy[index]]
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onError(null)
    setSaving(true)
    try {
      let itemId: string
      if (editingId) {
        itemId = editingId
        const existingUrls = imageEntries
          .filter((e): e is ImageEntry & { type: 'url' } => e.type === 'url')
          .map((e) => e.url)
        const newFiles = imageEntries.filter(
          (e): e is ImageEntry & { type: 'file' } => e.type === 'file'
        )
        const uploadedUrls = await Promise.all(
          newFiles.map((f) => uploadItemImage(itemId, f.file))
        )
        const images = [...existingUrls, ...uploadedUrls]
        await updateItem(itemId, {
          name,
          category: normalizeCategory(category),
          desc,
          rules,
          open,
          close,
          video,
          img: images[0] ?? img,
          active,
          images,
        })
      } else {
        const existingUrls = imageEntries
          .filter((e): e is ImageEntry & { type: 'url' } => e.type === 'url')
          .map((e) => e.url)
        const newFiles = imageEntries.filter(
          (e): e is ImageEntry & { type: 'file' } => e.type === 'file'
        )
        itemId = await createItem({
          name,
          category: normalizeCategory(category),
          desc,
          rules,
          open,
          close,
          video,
          img: existingUrls[0] ?? '',
          active,
        })
        const uploadedUrls = newFiles.length
          ? await Promise.all(newFiles.map((f) => uploadItemImage(itemId, f.file)))
          : []
        const allImages = [...existingUrls, ...uploadedUrls]
        if (allImages.length) {
          await updateItem(itemId, { images: allImages, img: allImages[0] })
        }
      }
      onSaved()
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <h2 className="font-black text-brand-red uppercase">
            {editingId ? 'Editar item' : 'Novo item'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Categoria">
              <button
                type="button"
                onClick={() => setNewCategoryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-brand-red text-brand-red bg-transparent hover:bg-red-50 transition-all"
                aria-label="Nova categoria"
              >
                +
              </button>
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm uppercase transition-all border-2 ${
                    category === c
                      ? 'bg-brand-red text-white border-brand-red'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-red/50'
                  }`}
                >
                  {c}
                </button>
              ))}
              {customCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm uppercase transition-all border-2 ${
                    normalizeCategory(category) === normalizeCategory(c)
                      ? 'bg-brand-red text-white border-brand-red'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-red/50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {newCategoryModalOpen && (
            <Modal
              open={true}
              onClose={() => {
                setNewCategoryModalOpen(false)
                setNewCategoryName('')
              }}
              title="Nova categoria"
              variant="center"
              size="md"
            >
              <div className="p-6 space-y-4">
                <label className="block">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Nome da categoria
                  </span>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCreateCategory()
                      }
                    }}
                    placeholder="Ex: Passeios"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategoryModalOpen(false)
                      setNewCategoryName('')
                    }}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={!newCategoryName.trim()}
                    className="flex-1 py-3 rounded-xl font-bold bg-brand-red text-white disabled:opacity-50 hover:bg-brand-red-hover"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </Modal>
          )}
          <ExpandableTextarea
            label="Descrição"
            value={desc}
            onChange={setDesc}
            rows={3}
            expandModalTitle="Descrição do item"
          />
          <ExpandableTextarea
            label="Tarifa reduzida / Gratuidade"
            value={rules}
            onChange={setRules}
            rows={2}
            expandModalTitle="Tarifa reduzida / Gratuidade"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Abertura / Saída
              </label>
              <input
                type="time"
                value={open}
                onChange={(e) => setOpen(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Fechamento / Retorno
              </label>
              <input
                type="time"
                value={close}
                onChange={(e) => setClose(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Fotos do item (galeria)
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              Primeira foto = capa. Arraste para reordenar. Sugestão: 5–10 fotos.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {imageEntries.map((entry, index) => (
                <div
                  key={entry.type === 'file' ? entry.id : entry.url}
                  className="flex flex-col rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-100"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                      src={
                        entry.type === 'file'
                          ? URL.createObjectURL(entry.file)
                          : entry.url
                      }
                      alt=""
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    {index === 0 && (
                      <span className="absolute top-0 left-0 right-0 text-[9px] font-black bg-brand-red text-white text-center py-0.5 rounded-t">
                        Capa
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-0.5 py-1 bg-black/40 rounded-b-lg">
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-white/90 hover:text-white disabled:opacity-30 rounded"
                      aria-label="Mover para esquerda"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === imageEntries.length - 1}
                      className="p-1 text-white/90 hover:text-white disabled:opacity-30 rounded"
                      aria-label="Mover para direita"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageDeleteTarget({ index })}
                      className="p-1 text-white/90 hover:text-red-200 rounded"
                      aria-label="Remover foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {imageDeleteTarget != null && (
              <Modal
                open={true}
                onClose={() => setImageDeleteTarget(null)}
                title="Remover foto?"
                variant="center"
                size="md"
              >
                <div className="p-6 space-y-4">
                  <p className="text-gray-700">
                    Deseja remover esta foto da galeria?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImageDeleteTarget(null)}
                      className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmRemoveImage}
                      className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </Modal>
            )}
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrlToAdd}
                onChange={(e) => setImageUrlToAdd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrlToGallery())}
                placeholder="https://... (adicionar URL na galeria)"
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addUrlToGallery}
                disabled={!isValidUrlToAdd}
                className="px-4 py-2 rounded-xl border-2 border-brand-red text-brand-red font-bold text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              >
                Adicionar URL
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => addFiles(e.target.files)}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Link do vídeo
            </label>
            <input
              type="url"
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              placeholder="https://..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">Visível no catálogo</label>
            <button
              type="button"
              role="switch"
              aria-checked={active}
              onClick={() => setActive(!active)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  active ? 'left-7' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-brand-red text-white font-bold disabled:opacity-50 hover:bg-brand-red-hover"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
