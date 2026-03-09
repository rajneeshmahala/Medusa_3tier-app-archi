import { getProducts } from "../lib/medusa-client";
import ProductCard from "../components/product/ProductCard";

export const revalidate = 60;

export default async function HomePage() {
  const { products } = await getProducts({ limit: 8 });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-28 text-center">
          <span className="inline-block rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-6">
            Powered by Medusa v2
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Commerce for the<br />
            <span className="text-indigo-400">modern web</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-indigo-200 mb-10">
            A fully headless storefront built on Medusa v2, deployed on Azure with Terraform and Ansible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/products"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-900 hover:bg-indigo-50 transition-colors shadow-lg">
              Browse Products
            </a>
            <a href="/app"
              className="rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors">
              Admin Dashboard →
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-2 text-gray-500">Add products from the admin dashboard to see them here.</p>
          </div>
          <a href="/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all →
          </a>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Head to the admin panel to add your first product.</p>
            <a href="/app"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              Open Admin →
            </a>
          </div>
        )}
      </section>

      {/* Features Banner */}
      <section className="bg-gray-50 border-y">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: "⚡", title: "Medusa v2 Backend", desc: "Modular commerce engine on VM2" },
            { icon: "🐘", title: "PostgreSQL Database", desc: "Persistent storage on VM3" },
            { icon: "🎛️", title: "Admin Dashboard", desc: "Full product management at /app" },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
