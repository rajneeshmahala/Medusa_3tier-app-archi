import { getProduct, getProducts } from "../../../lib/medusa-client";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const { products } = await getProducts({ limit: 100 });
  return products.map((p) => ({ handle: p.handle }));
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  if (!product) return notFound();

  const image    = product.thumbnail || product.images?.[0]?.url;
  const variant  = product.variants?.[0];
  const price    = variant?.calculated_price?.calculated_amount;
  const currency = variant?.calculated_price?.currency_code?.toUpperCase() || "USD";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <a href="/products" className="mb-8 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
        ← Back to products
      </a>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50">
          {image ? (
            <img src={image} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl text-gray-200">🛍️</div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 mb-2">
            {product.collection?.title || "General"}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

          {product.description && (
            <p className="text-lg text-gray-600 mb-8">{product.description}</p>
          )}

          <div className="mb-8">
            <span className="text-4xl font-extrabold text-gray-900">
              {price != null
                ? `${currency} ${(price / 100).toFixed(2)}`
                : "Price on request"}
            </span>
          </div>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <span key={v.id}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                    {v.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="w-full rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg">
            Add to Cart
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Manage this product in the{" "}
            <a href="/app" className="text-indigo-600 hover:underline">Admin Dashboard</a>
          </p>
        </div>
      </div>
    </div>
  );
}
