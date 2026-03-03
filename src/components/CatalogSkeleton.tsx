export function CatalogSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex bg-white rounded-3xl overflow-hidden border-4 border-gray-50 animate-pulse"
        >
          <div className="w-24 h-24 flex-shrink-0 bg-gray-200" />
          <div className="p-3 flex-1 space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded-full" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
