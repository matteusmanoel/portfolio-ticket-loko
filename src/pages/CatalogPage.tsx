import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
  lazy,
  Suspense,
} from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { motion, useReducedMotion } from "framer-motion";
import { CatalogCard } from "@/components/CatalogCard";
import { CasinoBackground } from "@/components/CasinoBackground";
import { CatalogHero } from "@/components/CatalogHero";
import { CatalogSkeleton } from "@/components/CatalogSkeleton";
import { CartFooter } from "@/components/CartFooter";
import { EmptyState } from "@/components/EmptyState";
import { Snackbar, type SnackbarVariant } from "@/components/Snackbar";
import { subscribeCatalog } from "@/services/catalogRepo";
import { useCartStore } from "@/features/cart/cartStore";
import {
  CATEGORIES,
  categoryMatchesFilter,
  getCustomCategoriesForFilter,
  type Attraction,
  type Category,
} from "@/types/catalog";

const ItemDetailModal = lazy(() =>
  import("@/components/ItemDetailModal").then((m) => ({
    default: m.ItemDetailModal,
  })),
);

const CartDrawer = lazy(() =>
  import("@/components/CartDrawer").then((m) => ({ default: m.CartDrawer })),
);

const LIST_ROW_HEIGHT = 200;

export function CatalogPage() {
  const reducedMotion = useReducedMotion();
  const [catalogState, setCatalogState] = useState<{
    status: "loading" | "error" | "ready";
    items?: Attraction[];
    error?: Error;
  }>({ status: "loading" });
  const [filter, setFilter] = useState<Category>("Todos");
  const [search, setSearch] = useState("");
  const [detailItem, setDetailItem] = useState<Attraction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarVariant, setSnackbarVariant] =
    useState<SnackbarVariant>("added");
  const [snackbarMessage, setSnackbarMessage] = useState(
    "Adicionado ao orçamento",
  );
  const [detailFromCart, setDetailFromCart] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
    try {
      const stored = localStorage.getItem("catalog-view-mode");
      return stored === "grid" ? "grid" : "list";
    } catch {
      return "list";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("catalog-view-mode", viewMode);
    } catch {
      /* ignore */
    }
  }, [viewMode]);

  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const cartIdSet = useMemo(
    () => new Set(cartItems.map((i) => i.id)),
    [cartItems],
  );

  useEffect(() => {
    const unsub = subscribeCatalog((state) => {
      setCatalogState(
        state.status === "ready"
          ? { status: "ready", items: state.items }
          : state.status === "error"
            ? { status: "error", error: state.error }
            : { status: "loading" },
      );
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    const items =
      catalogState.status === "ready" && Array.isArray(catalogState.items)
        ? catalogState.items
        : [];
    let list = items.filter((i) => i.active !== false);
    if (filter && String(filter).trim() !== "" && filter !== "Todos")
      list = list.filter((i) => categoryMatchesFilter(i.category, filter));
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          (i.name || "").toLowerCase().includes(q) ||
          (i.desc || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [catalogState, filter, search]);

  const categories: Category[] = [
    ...CATEGORIES,
    ...getCustomCategoriesForFilter(),
  ];

  const listRef = useRef<HTMLDivElement>(null);
  const [listScrollMargin, setListScrollMargin] = useState(0);
  const [headerCompact, setHeaderCompact] = useState(false);

  useLayoutEffect(() => {
    if (listRef.current)
      setListScrollMargin(
        listRef.current.getBoundingClientRect().top + window.scrollY,
      );
  }, [viewMode, filtered.length]);

  useEffect(() => {
    const rootEl = document.getElementById("root");
    const readScrollTop = () => {
      const docEl = document.documentElement;
      const body = document.body;
      return Math.max(
        window.scrollY || 0,
        docEl?.scrollTop || 0,
        body?.scrollTop || 0,
        rootEl?.scrollTop || 0,
      );
    };
    const update = () => setHeaderCompact(readScrollTop() > 24);

    update();
    window.addEventListener("scroll", update, { passive: true });
    rootEl?.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      rootEl?.removeEventListener("scroll", update);
    };
  }, []);

  const rowVirtualizer = useWindowVirtualizer({
    count: viewMode === "list" ? filtered.length : 0,
    estimateSize: () => LIST_ROW_HEIGHT,
    scrollMargin: listScrollMargin,
    overscan: 5,
  });

  const handleOpenDetail = (item: Attraction) => {
    setDetailFromCart(false);
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleOpenDetailFromCart = (item: Attraction) => {
    setCartOpen(false);
    requestAnimationFrame(() => {
      setDetailFromCart(true);
      setDetailItem(item);
      setDetailOpen(true);
    });
  };

  const handleAddToCart = () => {
    if (detailItem) {
      addItem({ id: detailItem.id, name: detailItem.name });
      setDetailOpen(false);
      setDetailItem(null);
      setSnackbarVariant("added");
      setSnackbarMessage("Adicionado ao orçamento");
      setSnackbarOpen(true);
    }
  };

  const handleRemoveFromCart = () => {
    if (detailItem) {
      removeItem(detailItem.id);
      setDetailOpen(false);
      setDetailItem(null);
      setDetailFromCart(false);
      setSnackbarVariant("removed");
      setSnackbarMessage("Item removido do orçamento.");
      setSnackbarOpen(true);
    }
  };

  const handleCartItemRemoved = () => {
    setSnackbarVariant("removed");
    setSnackbarMessage("Item removido do orçamento.");
    setSnackbarOpen(true);
  };

  const handleCartCleared = () => {
    setSnackbarVariant("removed");
    setSnackbarMessage("Orçamento limpo.");
    setSnackbarOpen(true);
  };

  const handleWatchVideo = () => {
    if (detailItem?.video) window.open(detailItem.video, "_blank");
  };

  const handleCardWatchVideo = (item: Attraction) => {
    if (item.video) window.open(item.video, "_blank");
  };

  const handleQuickAdd = (item: Attraction) => {
    addItem({ id: item.id, name: item.name });
    setSnackbarVariant("added");
    setSnackbarMessage("Adicionado ao orçamento");
    setSnackbarOpen(true);
  };

  const enableMotion = !reducedMotion && filtered.length <= 24;

  const gridContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  };

  return (
    <div className="min-h-screen relative">
      <CasinoBackground />

      {/* Centered container (desktop + mobile) */}
      <div className="relative z-10 w-full flex justify-center px-3 sm:px-4 lg:px-10 py-4 lg:py-10">
        {/* Main: surface panel */}
        <div className="w-full max-w-[980px] lg:bg-white/95 lg:rounded-3xl lg:border lg:border-yellow-200 lg:shadow-2xl lg:overflow-hidden">
          <CatalogHero
            compact={headerCompact}
            filter={filter}
            onFilter={setFilter}
            categories={categories}
            search={search}
            onSearch={setSearch}
            viewMode={viewMode}
            onViewMode={setViewMode}
            cartCount={cartItems.length}
            onOpenCart={() => setCartOpen(true)}
          />

          <main className="flex-1 w-full mx-auto px-4 lg:px-8 py-4 pb-32 lg:pb-10 lg:pt-6 max-w-[980px]">
            {catalogState.status === "loading" && <CatalogSkeleton />}
            {catalogState.status === "error" && (
              <div className="p-8 text-center">
                <p className="text-red-700 font-bold">
                  Erro ao carregar o catálogo. Tente novamente.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {catalogState.error?.message}
                </p>
              </div>
            )}
            {catalogState.status === "ready" && (
              <>
                <div
                  className="catalog-context-bar flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3 lg:mb-4"
                  role="status"
                  aria-live="polite"
                >
                  <span>
                    {filtered.length === 0
                      ? "Nenhum item encontrado"
                      : `${filtered.length} ${filtered.length === 1 ? "item encontrado" : "itens encontrados"}`}
                  </span>
                  {cartItems.length > 0 && (
                    <span className="text-brand-red font-semibold">
                      {cartItems.length} no orçamento
                    </span>
                  )}
                </div>
                {viewMode === "list" && filtered.length > 0 ? (
                  <div
                    ref={listRef}
                    key={`list-${filter}-${filtered.length}`}
                    className="relative w-full catalog-list"
                  >
                    <div
                      className="relative w-full"
                      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                    >
                      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const item = filtered[virtualRow.index];
                        if (!item) return null;
                        return (
                          <div
                            key={item.id}
                            className="absolute left-0 top-0 w-full pb-2"
                            style={{
                              height: `${virtualRow.size}px`,
                              transform: `translateY(${virtualRow.start - listScrollMargin}px)`,
                            }}
                          >
                            <CatalogCard
                              item={item}
                              variant="list"
                              onClick={() => handleOpenDetail(item)}
                              onQuickAdd={() => handleQuickAdd(item)}
                              onWatchVideo={() => handleCardWatchVideo(item)}
                              isInCart={cartIdSet.has(item.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : viewMode === "grid" || filtered.length === 0 ? (
                  <motion.div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 catalog-grid"
                        : "space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-1"
                    }
                    variants={enableMotion ? gridContainerVariants : undefined}
                    initial={enableMotion ? "hidden" : false}
                    animate={enableMotion ? "show" : undefined}
                  >
                    {filtered.length === 0 ? (
                      <div className="col-span-full flex justify-center">
                        <EmptyState
                          imageSrc="/Asset 8.png"
                          title={
                            search.trim()
                              ? "Nenhum resultado para essa busca."
                              : filter !== "Todos"
                                ? "Nenhum item nesta categoria."
                                : "Nenhum item encontrado."
                          }
                          subtitle={
                            search.trim()
                              ? "Tente outro termo ou limpe a busca para ver todos os itens."
                              : filter !== "Todos"
                                ? "Experimente voltar para “Todos” ou selecione outra categoria."
                                : "Tente novamente em instantes."
                          }
                          className="min-h-[35vh] py-10"
                          actionLabel={
                            search.trim()
                              ? "Limpar busca"
                              : filter !== "Todos"
                                ? "Ver todos"
                                : undefined
                          }
                          onAction={
                            search.trim()
                              ? () => setSearch("")
                              : filter !== "Todos"
                                ? () => setFilter("Todos")
                                : undefined
                          }
                        />
                      </div>
                    ) : (
                      filtered.map((item) =>
                        enableMotion ? (
                          <motion.div
                            key={item.id}
                            variants={cardVariants}
                            whileHover={{ y: -2 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 22,
                            }}
                          >
                            <CatalogCard
                              item={item}
                              variant={viewMode}
                              onClick={() => handleOpenDetail(item)}
                              onQuickAdd={() => handleQuickAdd(item)}
                              onWatchVideo={() => handleCardWatchVideo(item)}
                              isInCart={cartIdSet.has(item.id)}
                            />
                          </motion.div>
                        ) : (
                          <div key={item.id}>
                            <CatalogCard
                              item={item}
                              variant={viewMode}
                              onClick={() => handleOpenDetail(item)}
                              onQuickAdd={() => handleQuickAdd(item)}
                              onWatchVideo={() => handleCardWatchVideo(item)}
                              isInCart={cartIdSet.has(item.id)}
                            />
                          </div>
                        ),
                      )
                    )}
                  </motion.div>
                ) : null}
              </>
            )}
          </main>

          {/* Mobile: footer CTA + drawer */}
          <div className="lg:hidden">
            <CartFooter
              count={cartItems.length}
              onOpen={() => setCartOpen(true)}
            />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          catalogItems={
            catalogState.status === "ready" ? (catalogState.items ?? []) : []
          }
          onOpenItemDetail={handleOpenDetailFromCart}
          onItemRemoved={handleCartItemRemoved}
          onCartCleared={handleCartCleared}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ItemDetailModal
          item={detailItem}
          open={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setDetailItem(null);
            setDetailFromCart(false);
          }}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={
            detailFromCart && detailItem ? handleRemoveFromCart : undefined
          }
          onOpenCart={() => setCartOpen(true)}
          isInCart={detailItem ? cartIdSet.has(detailItem.id) : false}
          onWatchVideo={handleWatchVideo}
        />
      </Suspense>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        variant={snackbarVariant}
        message={snackbarMessage}
        actionLabel={snackbarVariant === "added" ? "Ver orçamento" : undefined}
        onAction={
          snackbarVariant === "added" ? () => setCartOpen(true) : undefined
        }
      />
    </div>
  );
}
