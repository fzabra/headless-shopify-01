import Link from "next/link";

const footerColumns = [
  {
    title: "Themes",
    links: ["Weebly Themes", "Pre-Sale FAQs", "Submit a Ticket"]
  },
  {
    title: "Services",
    links: ["Services", "Theme Tweak"]
  },
  {
    title: "Showcase",
    links: ["Showcase", "WidgetKit", "Support"]
  },
  {
    title: "About",
    links: ["About Us", "Contact Us", "Affiliates", "Resources"]
  }
];

const socialLinks = [
  { label: "Facebook", symbol: "f", href: "#" },
  { label: "Twitter", symbol: "t", href: "#" },
  { label: "RSS", symbol: "r", href: "#" },
  { label: "Google", symbol: "g", href: "#" },
  { label: "More", symbol: "o", href: "#" }
];

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-inner">
        <section className="footer-top">
          <div className="footer-brand">
            <p className="footer-logo">LOGO</p>
            <p className="footer-tagline">SLOGAN COMPANY</p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} className="footer-nav" aria-label={column.title}>
              {column.links.map((link) => (
                <Link key={link} href="#">
                  {link}
                </Link>
              ))}
            </nav>
          ))}
        </section>

        <div className="footer-divider" />

        <section className="footer-bottom">
          <div className="footer-socials" aria-label="Social links">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="footer-social-link"
                aria-label={social.label}
              >
                <span>{social.symbol}</span>
              </Link>
            ))}
          </div>
          <p className="footer-copy">&copy;Copyright. All rights reserved.</p>
        </section>
      </div>
    </footer>
  );
}
