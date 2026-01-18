import type { Metadata } from "next";
import "./globals.scss";

// Import the feedback toolbar from local lib
import { FeedbackToolbar } from "../../lib";

export const metadata: Metadata = {
  title: "Feedback Tool Example",
  description: "Example page for testing the feedback annotation toolbar",
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
        {/* The feedback toolbar - renders in bottom-right corner */}
        <FeedbackToolbar />
      </body>
    </html>
  );
}
