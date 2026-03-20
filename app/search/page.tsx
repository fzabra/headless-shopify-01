import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/shopify/api";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const products = query.length >= 2 ? await searchProducts(query) : [];

  return (
    <section className="stack">
      <h1 className="page-title">Search</h1>

      <form action="/search" className="search-form">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search products..."
          minLength={2}
          required
        />
        <button type="submit" className="primary">
          Search
        </button>
      </form>

      {query.length === 0 ? (
        <p className="text-muted">Type at least 2 characters to search.</p>
      ) : (
        <p className="text-muted">
          Showing results for <strong>{query}</strong>. <Link href="/collections">Browse collections</Link>
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query.length >= 2 ? (
        <p className="text-muted">No products found.</p>
      ) : null}
    </section>
  );
}
