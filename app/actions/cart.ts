"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addCartLine,
  createCart,
  removeCartLine,
  updateCartLine
} from "@/lib/shopify/api";

const CART_COOKIE = "shopifyCartId";

function parsePositiveInt(value: FormDataEntryValue | null, fallback = 1) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return fallback;
  }

  return Math.floor(numeric);
}

export async function addToCartAction(formData: FormData) {
  const merchandiseId = String(formData.get("merchandiseId") || "");
  const quantity = parsePositiveInt(formData.get("quantity"), 1);

  if (!merchandiseId) {
    throw new Error("Missing merchandiseId.");
  }

  const cookieStore = await cookies();
  let cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    cartId = await createCart(merchandiseId, quantity);

    cookieStore.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  } else {
    await addCartLine(cartId, merchandiseId, quantity);
  }

  revalidatePath("/");
  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") || "");
  const quantity = Number(formData.get("quantity") || 1);

  if (!lineId) {
    throw new Error("Missing lineId.");
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return;
  }

  if (quantity <= 0) {
    await removeCartLine(cartId, lineId);
  } else {
    await updateCartLine(cartId, lineId, Math.floor(quantity));
  }

  revalidatePath("/cart");
}

export async function removeCartLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") || "");

  if (!lineId) {
    throw new Error("Missing lineId.");
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return;
  }

  await removeCartLine(cartId, lineId);
  revalidatePath("/cart");
}
