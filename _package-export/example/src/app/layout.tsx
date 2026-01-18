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
      <Link href="/" className="nav-link">Overview</Link>
      <Link href="/install" className="nav-link">Install</Link>
      <Link href="/features" className="nav-link">Features</Link>
      <Link href="/output" className="nav-link">Output</Link>
      <Link href="/changelog" className="nav-link">Changelog</Link>
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
        <ToolbarProvider />
      </body>
    </html>
  );
}
