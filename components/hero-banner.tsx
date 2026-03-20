import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "@/lib/shopify/types";

function normalizeCtaUrl(url: string) {
  if (!url) {
    return "/collections";
  }

  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }

  return `/${url}`;
}

export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  if (slides.length === 0) {
    return (
      <section className="hero">
        <h1>Shopify Headless Storefront</h1>
        <p>
          Projeto de portfolio: frontend com Next.js consumindo produtos, colecoes e
          carrinho via Shopify Storefront API.
        </p>

        <div className="actions-row">
          <Link href="/collections" className="btn primary">
            Explore collections
          </Link>
          <Link href="/search" className="btn">
            Search products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-slider hero-slider--full" aria-label="Hero promotions">
      <div className="hero-track">
        {slides.map((slide) => {
          const ctaUrl = normalizeCtaUrl(slide.ctaUrl);
          const isExternal = ctaUrl.startsWith("http://") || ctaUrl.startsWith("https://");

          return (
            <article className="hero-slide" key={slide.id} id={`slide-${slide.handle}`}>
              {slide.image ? (
                <Image
                  src={slide.image.url}
                  alt={slide.image.altText || slide.title || "Hero banner"}
                  width={1400}
                  height={700}
                  className="hero-slide-image"
                  priority
                />
              ) : null}

              <div className="hero-overlay">
                <p className="hero-kicker">New collection</p>
                <h1>{slide.title || "Shopify Headless Storefront"}</h1>
                <p>{slide.subtitle || "Experiencia headless gerenciada pelo admin da Shopify."}</p>
                <div className="actions-row">
                  {isExternal ? (
                    <a href={ctaUrl} className="btn primary" target="_blank" rel="noreferrer">
                      {slide.ctaLabel || "Shop now"}
                    </a>
                  ) : (
                    <Link href={ctaUrl} className="btn primary">
                      {slide.ctaLabel || "Shop now"}
                    </Link>
                  )}
                  <Link href="/search" className="btn">
                    Search products
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hero-dots" aria-label="Slide navigation">
        {slides.map((slide, index) => (
          <a href={`#slide-${slide.handle}`} key={slide.id} aria-label={`Go to slide ${index + 1}`}>
            {index + 1}
          </a>
        ))}
      </div>
    </section>
  );
}
