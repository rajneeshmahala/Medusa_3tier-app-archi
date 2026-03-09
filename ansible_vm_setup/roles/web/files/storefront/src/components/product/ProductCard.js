export default function ProductCard({ product }) {
  const image     = product.thumbnail || product.images?.[0]?.url;
  const variant   = product.variants?.[0];
  const price     = variant?.calculated_price?.calculated_amount;
  const currency  = variant?.calculated_price?.currency_code?.toUpperCase() || "USD";

  return (
    <a href={`/products/${product.handle}`}
      className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-50">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-gray-200">🛍️</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-600 mb-1">
          {product.collection?.title || "General"}
        </p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {product.title}
        </h3>
        {product.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {price != null
              ? `${currency} ${(price / 100).toFixed(2)}`
              : "Price on request"}
          </span>
          <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
            View →
          </span>
        </div>
      </div>
    </a>
  );
}
