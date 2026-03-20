import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  removeCartLineAction,
  updateCartLineAction
} from "@/app/actions/cart";
import { CheckoutModal } from "@/components/checkout-modal";
import { getCart } from "@/lib/shopify/api";
import { formatMoney } from "@/lib/shopify/client";

const CART_COOKIE = "shopifyCartId";
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  const cart = cartId ? await getCart(cartId) : null;

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <section className="stack">
        <h1 className="page-title">Cart</h1>
        <p className="text-muted">Your cart is empty.</p>
        <div>
          <Link href="/collections" className="btn primary">
            Start shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <h1 className="page-title">Cart</h1>

      <div className="stack">
        {cart.lines.nodes.map((line) => (
          <article className="card" key={line.id}>
            <div className="card-body cart-line">
              {line.merchandise.product.featuredImage ? (
                <Image
                  src={line.merchandise.product.featuredImage.url}
                  alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                  width={80}
                  height={80}
                />
              ) : (
                <div className="card-media placeholder">No image</div>
              )}

              <div>
                <h2>
                  <Link href={`/products/${line.merchandise.product.handle}`}>
                    {line.merchandise.product.title}
                  </Link>
                </h2>
                <p className="text-muted">Variant: {line.merchandise.title}</p>
                <p>
                  {formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
                </p>
              </div>

              <div className="stack">
                <form action={updateCartLineAction} className="inline-form">
                  <input type="hidden" name="lineId" value={line.id} />
                  <input type="hidden" name="quantity" value={Math.max(1, line.quantity - 1)} />
                  <button type="submit" aria-label="Decrease quantity">
                    -
                  </button>
                </form>

                <p>Qty: {line.quantity}</p>

                <form action={updateCartLineAction} className="inline-form">
                  <input type="hidden" name="lineId" value={line.id} />
                  <input type="hidden" name="quantity" value={line.quantity + 1} />
                  <button type="submit" aria-label="Increase quantity">
                    +
                  </button>
                </form>

                <form action={removeCartLineAction}>
                  <input type="hidden" name="lineId" value={line.id} />
                  <button type="submit">Remove</button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>

      <article className="card">
        <div className="card-body stack">
          <p>
            Subtotal: {" "}
            <strong>
              {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
            </strong>
          </p>

          <p>
            Total: {" "}
            <strong>{formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</strong>
          </p>

          <CheckoutModal
            checkoutUrl={cart.checkoutUrl}
            itemsCount={cart.totalQuantity}
            totalLabel={formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
          />
        </div>
      </article>
    </section>
  );
}
