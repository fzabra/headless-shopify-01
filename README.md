# Shopify Headless Portfolio Boilerplate

Boilerplate com **Next.js App Router** consumindo a **Shopify Storefront API (GraphQL)**.

## Requisitos

- Node.js 20+
- Uma Shopify Development Store
- Storefront Access Token ativo

## Setup

1. Instale dependencias:

```bash
npm install
```

2. Configure ambiente:

```bash
cp .env.example .env.local
```

3. Preencha:

- `SHOPIFY_STORE_DOMAIN` (ex.: `minha-loja.myshopify.com`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_API_VERSION` (ex.: `2025-10`)

4. Rode:

```bash
npm run dev
```

## Rotas

- `/` Home com produtos em destaque
- `/collections` Lista colecoes
- `/collections/[handle]` Produtos por colecao
- `/products/[handle]` Produto + variantes + add to cart
- `/search?q=...` Busca
- `/cart` Carrinho

## Estrutura

- `lib/shopify/client.ts`: cliente GraphQL
- `lib/shopify/queries.ts`: queries e mutations
- `lib/shopify/types.ts`: tipos usados no app
- `app/actions/cart.ts`: server actions de carrinho
