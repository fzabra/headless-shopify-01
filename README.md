# Shopify Headless Portfolio Boilerplate

Boilerplate built with **Next.js App Router** consuming the **Shopify Storefront API (GraphQL)**.

## Requirements

- Node.js 20+
- A Shopify Development Store
- An active Storefront Access Token

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure the environment:

```bash
cp .env.example .env.local
```

3. Fill in:

- `SHOPIFY_STORE_DOMAIN` (e.g.: `my-store.myshopify.com`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_API_VERSION` (e.g.: `2025-10`)

4. Run:

```bash
npm run dev
```

## Routes

- `/` Home with featured products
- `/collections` Collections list
- `/collections/[handle]` Products by collection
- `/products/[handle]` Product details + variants + add to cart
- `/search?q=...` Search
- `/cart` Cart

## Structure

- `lib/shopify/client.ts`: GraphQL client
- `lib/shopify/queries.ts`: queries and mutations
- `lib/shopify/types.ts`: app types
- `app/actions/cart.ts`: cart server actions
