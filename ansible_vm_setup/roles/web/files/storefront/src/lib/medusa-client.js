import Medusa from "@medusajs/js-sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

// Helper: fetch products
export async function getProducts(params = {}) {
  try {
    const { products, count } = await medusa.store.product.list({
      limit: 12,
      fields: "+variants.calculated_price",
      ...params,
    });
    return { products, count };
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
    return { products: [], count: 0 };
  }
}

// Helper: fetch single product
export async function getProduct(handle) {
  try {
    const { products } = await medusa.store.product.list({ handle });
    return products[0] || null;
  } catch (err) {
    console.error("Failed to fetch product:", err.message);
    return null;
  }
}

// Helper: fetch regions
export async function getRegions() {
  try {
    const { regions } = await medusa.store.region.list();
    return regions;
  } catch (err) {
    console.error("Failed to fetch regions:", err.message);
    return [];
  }
}
