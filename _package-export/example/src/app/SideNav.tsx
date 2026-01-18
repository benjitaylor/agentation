"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Overview" },
    { href: "/install", label: "Install" },
    { href: "/features", label: "Features" },
    { href: "/output", label: "Output" },
    { href: "/changelog", label: "Changelog" },
  ];

  return (
    <nav className="side-nav">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`nav-link ${pathname === link.href ? "active" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
