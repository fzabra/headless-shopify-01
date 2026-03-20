import { shopifyFetch } from "@/lib/shopify/client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  HERO_SLIDES_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY
} from "@/lib/shopify/queries";
import type { Cart, Collection, HeroSlide, Image, Product } from "@/lib/shopify/types";

type ProductsResponse = {
  products: {
    nodes: Product[];
  };
};

type ProductByHandleResponse = {
  product: Product | null;
};

type CollectionsResponse = {
  collections: {
    nodes: Collection[];
  };
};

type MetaobjectField = {
  key: string;
  value: string | null;
  reference:
    | {
        __typename: "MediaImage";
        image: Image | null;
      }
    | null;
};

type HeroSlidesResponse = {
  metaobjects: {
    nodes: Array<{
      id: string;
      handle: string;
      fields: MetaobjectField[];
    }>;
  };
};

type CollectionByHandleResponse = {
  collection:
    | (Collection & {
        products: {
          nodes: Product[];
        };
      })
    | null;
};

type CartResponse = {
  cart: Cart | null;
};

type MutationUserError = {
  message: string;
};

type CartCreateResponse = {
  cartCreate: {
    cart: { id: string } | null;
    userErrors: MutationUserError[];
  };
};

type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: { id: string } | null;
    userErrors: MutationUserError[];
  };
};

type CartLinesUpdateResponse = {
  cartLinesUpdate: {
    cart: { id: string } | null;
    userErrors: MutationUserError[];
  };
};

type CartLinesRemoveResponse = {
  cartLinesRemove: {
    cart: { id: string } | null;
    userErrors: MutationUserError[];
  };
};

function assertNoUserErrors(errors: MutationUserError[]) {
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }
}

function getFieldValue(fields: MetaobjectField[], key: string) {
  return fields.find((field) => field.key === key)?.value ?? "";
}

function getFieldImage(fields: MetaobjectField[], key: string) {
  const field = fields.find((item) => item.key === key);
  if (!field?.reference || field.reference.__typename !== "MediaImage") {
    return null;
  }

  return field.reference.image;
}

export async function getProducts(first = 12) {
  const data = await shopifyFetch<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { first }
  });

  return data.products.nodes;
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<ProductByHandleResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle }
  });

  return data.product;
}

export async function getCollections(first = 20) {
  const data = await shopifyFetch<CollectionsResponse>({
    query: COLLECTIONS_QUERY,
    variables: { first }
  });

  return data.collections.nodes;
}

export async function getCollectionByHandle(handle: string, first = 20) {
  const data = await shopifyFetch<CollectionByHandleResponse>({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, first }
  });

  return data.collection;
}

export async function searchProducts(query: string) {
  const data = await shopifyFetch<ProductsResponse>({
    query: SEARCH_PRODUCTS_QUERY,
    variables: { query }
  });

  return data.products.nodes;
}

export async function getHeroSlides(first = 8) {
  const data = await shopifyFetch<HeroSlidesResponse>({
    query: HERO_SLIDES_QUERY,
    variables: { type: "hero_slide", first }
  });

  const slides = data.metaobjects.nodes.map((node): HeroSlide => ({
    id: node.id,
    handle: node.handle,
    title: getFieldValue(node.fields, "title"),
    subtitle: getFieldValue(node.fields, "subtitle"),
    ctaLabel: getFieldValue(node.fields, "cta_label"),
    ctaUrl: getFieldValue(node.fields, "cta_url"),
    order: Number(getFieldValue(node.fields, "order")) || 9999,
    image: getFieldImage(node.fields, "image")
  }));

  return slides.sort((a, b) => a.order - b.order);
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch<CartResponse>({
    query: CART_QUERY,
    variables: { cartId },
    cache: "no-store"
  });

  return data.cart;
}

export async function createCart(merchandiseId: string, quantity = 1) {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    variables: { merchandiseId, quantity },
    cache: "no-store"
  });

  assertNoUserErrors(data.cartCreate.userErrors);

  if (!data.cartCreate.cart?.id) {
    throw new Error("Failed to create cart.");
  }

  return data.cartCreate.cart.id;
}

export async function addCartLine(cartId: string, merchandiseId: string, quantity = 1) {
  const data = await shopifyFetch<CartLinesAddResponse>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, merchandiseId, quantity },
    cache: "no-store"
  });

  assertNoUserErrors(data.cartLinesAdd.userErrors);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await shopifyFetch<CartLinesUpdateResponse>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lineId, quantity },
    cache: "no-store"
  });

  assertNoUserErrors(data.cartLinesUpdate.userErrors);
}

export async function removeCartLine(cartId: string, lineId: string) {
  const data = await shopifyFetch<CartLinesRemoveResponse>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds: [lineId] },
    cache: "no-store"
  });

  assertNoUserErrors(data.cartLinesRemove.userErrors);
}
