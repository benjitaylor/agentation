import type { Metadata } from "next";
import "./globals.scss";
import { ToolbarProvider } from "./ToolbarProvider";
import { SideNav } from "./SideNav";
import { MobileNotice } from "./MobileNotice";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Cascadia+Code:ital@1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MobileNotice />
        <SideNav />
        <main className="main-content">
          {children}
        </main>
        <ToolbarProvider />
      </body>
    </html>
  );
}
