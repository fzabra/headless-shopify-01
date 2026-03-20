import Link from "next/link";
import { HeaderSearch } from "@/components/header-search";

export function Header() {
  return (
    <header className="site-header">
      <div className="nav-row header-inner">
        <Link href="/" className="brand">
          Headless Portfolio Store
        </Link>

        <HeaderSearch />

        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/collections">Collections</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>
    </header>
  );
}
