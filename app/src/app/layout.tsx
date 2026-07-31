import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevToolBox",
  description: "Free Online Developer Tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
