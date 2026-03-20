import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="nav-row header-inner">
        <Link href="/" className="brand">
          Headless Portfolio Store
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/collections">Collections</Link>
          <Link href="/search">Search</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>
    </header>
  );
}
