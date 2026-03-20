"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Suggestion = {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
};

export function HeaderSearch() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Suggestion[]>([]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search-suggest?q=${encodeURIComponent(trimmed)}`);
        const data = (await response.json()) as { products?: Suggestion[] };
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div className="header-search-wrap" ref={wrapperRef}>
      <form action="/search" className="header-search" role="search" aria-label="Search products">
        <input
          type="search"
          name="q"
          value={query}
          placeholder="Search products..."
          minLength={2}
          required
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!open) {
              setOpen(true);
            }
          }}
        />
        <button type="submit" className="primary">
          Search
        </button>
      </form>

      {showDropdown ? (
        <div className="header-search-dropdown" role="listbox" aria-label="Search suggestions">
          {loading ? <p className="header-search-state">Searching...</p> : null}

          {!loading && results.length === 0 ? (
            <p className="header-search-state">No products found.</p>
          ) : null}

          {!loading && results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.handle}`} onClick={() => setOpen(false)}>
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        width={44}
                        height={56}
                      />
                    ) : (
                      <span className="header-search-thumb-placeholder" />
                    )}
                    <span>{product.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
