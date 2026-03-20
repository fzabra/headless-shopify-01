import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/shopify/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  if (query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(query);
    const suggestions = products.slice(0, 6).map((product) => ({
      id: product.id,
      handle: product.handle,
      title: product.title,
      featuredImage: product.featuredImage
    }));

    return NextResponse.json({ products: suggestions });
  } catch {
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
