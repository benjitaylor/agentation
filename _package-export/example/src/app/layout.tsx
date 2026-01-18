import type { Metadata } from "next";
import "./globals.scss";
import { ToolbarProvider } from "./ToolbarProvider";
import { SideNav } from "./SideNav";

export const metadata: Metadata = {
  title: "Agentation",
  description: "Visual feedback for AI coding agents",
};

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
