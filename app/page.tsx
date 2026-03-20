import { HeroBanner } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { getHeroSlides, getProducts } from "@/lib/shopify/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, slides] = await Promise.all([getProducts(12), getHeroSlides(5)]);

  return (
    <div className="stack">
      <HeroBanner slides={slides} />

      <section>
        <h2 className="page-title">Featured products</h2>
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
