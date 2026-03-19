import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introducing Agentation 2.0",
  description:
    "Annotations become a two-way conversation. Your AI agent can now see, respond to, and resolve your feedback in real time.",
  openGraph: {
    title: "Introducing Agentation 2.0",
    description:
      "Annotations become a two-way conversation. Your AI agent can now see, respond to, and resolve your feedback in real time.",
    images: [
      {
        url: "/blog/agentation-2.png",
        width: 900,
        height: 472,
        alt: "Agentation 2.0 - Action all my feedback",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Agentation 2.0",
    description:
      "Annotations become a two-way conversation. Your AI agent can now see, respond to, and resolve your feedback in real time.",
    images: ["/blog/agentation-2.png"],
  },
};

export default function Agentation2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
