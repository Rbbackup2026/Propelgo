import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.propelgo.in"),
  title: {
    default: "PropelGo | Enterprise Payment Infrastructure",
    template: "%s · PropelGo",
  },
  description:
    "PropelGo helps businesses move, manage and control money with vendor payments on virtual cards (Versa), OD/CC-linked commercial cards (ODCC) and a multi-bank payment orchestration layer.",
  openGraph: {
    type: "website",
    siteName: "PropelGo",
    title: "PropelGo | Powering the way businesses move and manage money",
    description:
      "Enterprise payment infrastructure for vendor payments, commercial credit, cards and payment orchestration.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${inter.variable} antialiased`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
