import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API | Agentation",
  description: "Programmatic access for developers.",
};

export default function APILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
