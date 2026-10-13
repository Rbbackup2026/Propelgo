import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Ecosystem } from "@/components/home/Ecosystem";
import { FinalCta } from "@/components/home/FinalCta";
import { HeroC } from "@/components/options/HeroC";
import { ProductsC } from "@/components/options/ProductsC";
import { DirectionSwitcher } from "@/components/options/DirectionSwitcher";

export const metadata: Metadata = {
  title: "Direction C",
  robots: { index: false, follow: false },
};

export default function DirectionC() {
  return (
    <>
      <Header />
      <main>
        <HeroC />
        <Ecosystem />
        <ProductsC />
        <div className="h-24 md:h-32" />
        <FinalCta />
      </main>
      <Footer />
      <DirectionSwitcher current="c" />
    </>
  );
}
