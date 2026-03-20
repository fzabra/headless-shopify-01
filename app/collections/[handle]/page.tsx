import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCollectionByHandle } from "@/lib/shopify/api";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle, 40);

  if (!collection) {
    notFound();
  }

  return (
    <section className="stack">
      <header>
        <h1 className="page-title">{collection.title}</h1>
        {collection.description ? <p className="text-muted">{collection.description}</p> : null}
      </header>

      {collection.products.nodes.length === 0 ? (
        <p className="text-muted">No products in this collection.</p>
      ) : (
        <div className="grid">
          {collection.products.nodes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
