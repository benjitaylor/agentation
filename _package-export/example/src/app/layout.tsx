import type { Metadata } from "next";
import "./globals.scss";

// Import from local lib - using CSS version (no framer-motion dep)
// Switch to { Agentation } for framer-motion version
import { AgentationCSS as Agentation } from "../../lib";

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
        {children}
        {/* Agentation toolbar - renders in bottom-right corner */}
        <Agentation />
      </body>
    </html>
  );
}
