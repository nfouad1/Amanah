import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amanah - Support Your Family, Together",
  description: "A private crowdfunding platform for families to support each other. Built on trust.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
