import type { Metadata } from "next";
import Link from "next/link";
import "./globals.scss";
import { ToolbarProvider } from "./ToolbarProvider";

export const metadata: Metadata = {
  title: "Agentation",
  description: "Visual feedback for AI coding agents",
};

function SideNav() {
  return (
    <nav className="side-nav">
      <Link href="/" className="nav-link">Docs</Link>
      <Link href="/changelog" className="nav-link">Changelog</Link>
      <Link href="/css-version" className="nav-link">CSS Version</Link>
      <Link href="/logic" className="nav-link">Logic</Link>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SideNav />
        <main className="main-content">
          {children}
        </main>
        {/* Agentation toolbar - switches between framer-motion and CSS versions based on route */}
        <ToolbarProvider />
      </body>
    </html>
  );
}
