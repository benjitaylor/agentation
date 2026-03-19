import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API | Agentation",
  description: "Programmatic access for developers.",
  openGraph: {
    title: "API | Agentation",
    description: "Programmatic access for developers.",
    images: [
      {
        url: "/api-og.png",
        width: 3600,
        height: 1890,
        alt: "Agentation API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "API | Agentation",
    description: "Programmatic access for developers.",
    images: ["/api-og.png"],
  },
};

export default function APILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
