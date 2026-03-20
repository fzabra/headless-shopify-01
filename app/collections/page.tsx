import Link from "next/link";
import { getCollections } from "@/lib/shopify/api";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getCollections(24);

  return (
    <section>
      <h1 className="page-title">Collections</h1>

      {collections.length === 0 ? (
        <p className="text-muted">No collections found.</p>
      ) : (
        <div className="grid">
          {collections.map((collection) => (
            <article key={collection.id} className="card">
              <div className="card-body stack">
                <h2>{collection.title}</h2>
                <p className="text-muted">{collection.description || "No description"}</p>
                <div>
                  <Link className="btn" href={`/collections/${collection.handle}`}>
                    View products
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
