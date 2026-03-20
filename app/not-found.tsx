import Link from "next/link";

export default function NotFound() {
  return (
    <section className="stack">
      <h1 className="page-title">Page not found</h1>
      <p className="text-muted">This route does not exist in the storefront.</p>
      <div>
        <Link href="/" className="btn primary">
          Back home
        </Link>
      </div>
    </section>
  );
}
