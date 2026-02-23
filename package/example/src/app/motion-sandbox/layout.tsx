import type { Metadata } from "next";
import { MotionProvider } from "./MotionProvider";

export const metadata: Metadata = {
  title: "Motion Sandbox — Agentation",
};

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MotionProvider />
    </>
  );
}
