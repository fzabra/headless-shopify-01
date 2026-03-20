"use client";

import { useState } from "react";

type CheckoutModalProps = {
  checkoutUrl: string;
  totalLabel: string;
  itemsCount: number;
};

export function CheckoutModal({
  checkoutUrl,
  totalLabel,
  itemsCount
}: CheckoutModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn primary" onClick={() => setOpen(true)}>
        Proceed to checkout
      </button>

      {open ? (
        <div className="checkout-modal-backdrop" role="dialog" aria-modal="true">
          <div className="checkout-modal">
            <h3>Ready to finish your order?</h3>
            <p className="text-muted">
              You have {itemsCount} {itemsCount === 1 ? "item" : "items"} in your cart.
            </p>
            <p>
              Total: <strong>{totalLabel}</strong>
            </p>
            <p className="text-muted">
              Payment and shipping are finalized in Shopify secure checkout.
            </p>

            <div className="checkout-modal-actions">
              <button type="button" onClick={() => setOpen(false)}>
                Continue shopping
              </button>
              <a
                href={checkoutUrl}
                className="btn primary"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
              >
                Go to Shopify checkout
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
