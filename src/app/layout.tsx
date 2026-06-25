import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalSite AI — Admin Dashboard",
  description:
    "Manage scraped local-business prospects and build their websites.",
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

