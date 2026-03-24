import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introducing Layout Mode",
  description:
    "Show your agent where things go — drag components, rearrange sections, and wireframe pages instead of describing layouts in words.",
  openGraph: {
    title: "Introducing Layout Mode",
    description:
      "Show your agent where things go — drag components, rearrange sections, and wireframe pages instead of describing layouts in words.",
    images: [
      {
        url: "/blog/layout-mode.png",
        width: 1506,
        height: 916,
        alt: "Layout mode — place components, rearrange sections, and build layouts spatially",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Layout Mode",
    description:
      "Show your agent where things go — drag components, rearrange sections, and wireframe pages instead of describing layouts in words.",
    images: ["/blog/layout-mode.png"],
  },
};

export default function LayoutModeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
