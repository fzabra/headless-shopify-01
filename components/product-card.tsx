import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/shopify/client";
import type { Product } from "@/lib/shopify/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card product-card">
      <Link href={`/products/${product.handle}`} className="card-media-link">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            width={640}
            height={640}
            className="card-media"
          />
        ) : (
          <div className="card-media placeholder">No image</div>
        )}
      </Link>

      <div className="card-body">
        <h3>
          <Link href={`/products/${product.handle}`}>{product.title}</Link>
        </h3>
        <p className="price">
          {formatMoney(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
          )}
        </p>
      </div>
    </article>
  );
}
