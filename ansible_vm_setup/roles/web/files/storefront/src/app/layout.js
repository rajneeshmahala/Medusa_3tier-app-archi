import "./globals.css";

export const metadata = {
  title: "Medusa Store",
  description: "Powered by Medusa v2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="text-2xl font-bold tracking-tight text-gray-900">
              Medusa<span className="text-indigo-600">Store</span>
            </a>
            <nav className="flex items-center gap-8">
              <a href="/"        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Products</a>
              <a href="/app"      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Admin</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-10 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} MedusaStore — Built with Medusa v2</p>
            <p className="mt-1">
              <a href="/app" className="text-indigo-600 hover:underline">Admin Dashboard</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
