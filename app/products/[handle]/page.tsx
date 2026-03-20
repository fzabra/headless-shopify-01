import Image from "next/image";
import { notFound } from "next/navigation";
import { addToCartAction } from "@/app/actions/cart";
import { formatMoney } from "@/lib/shopify/client";
import { getProductByHandle } from "@/lib/shopify/api";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return (
    <article className="product-layout">
      <section>
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            width={900}
            height={900}
            className="product-image"
            priority
          />
        ) : (
          <div className="card-media placeholder">No image</div>
        )}
      </section>

      <section className="stack">
        <h1 className="page-title">{product.title}</h1>

        <p>
          {formatMoney(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
          )}
        </p>

        <p className="text-muted">{product.description || "No description"}</p>

        <div className="variant-list">
          {(product.variants?.nodes || []).map((variant) => (
            <div key={variant.id} className="variant-row">
              <div>
                <strong>{variant.title}</strong>
                <p className="text-muted">
                  {formatMoney(variant.price.amount, variant.price.currencyCode)}
                </p>
              </div>

              {variant.availableForSale ? (
                <form action={addToCartAction}>
                  <input type="hidden" name="merchandiseId" value={variant.id} />
                  <input type="hidden" name="quantity" value="1" />
                  <button type="submit" className="primary">
                    Add to cart
                  </button>
                </form>
              ) : (
                <button type="button" disabled>
                  Sold out
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
