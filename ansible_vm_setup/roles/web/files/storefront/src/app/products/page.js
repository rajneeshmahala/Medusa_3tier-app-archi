import { getProducts } from "../../lib/medusa-client";
import ProductCard from "../../components/product/ProductCard";

export const revalidate = 60;

export default async function ProductsPage() {
  const { products, count } = await getProducts({ limit: 24 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
        <p className="mt-2 text-gray-500">{count} product{count !== 1 ? "s" : ""} available</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-32 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No products yet</h2>
          <p className="text-gray-500 mb-6">Add products from the Medusa admin dashboard.</p>
          <a href="/app"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Go to Admin →
          </a>
        </div>
      )}
    </div>
  );
}
