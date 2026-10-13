import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Ecosystem } from "@/components/home/Ecosystem";
import { FinalCta } from "@/components/home/FinalCta";
import { HeroB } from "@/components/options/HeroB";
import { ProductsB } from "@/components/options/ProductsB";
import { DirectionSwitcher } from "@/components/options/DirectionSwitcher";

export const metadata: Metadata = {
  title: "Direction B",
  robots: { index: false, follow: false },
};

export default function DirectionB() {
  return (
    <>
      <Header />
      <main>
        <HeroB />
        <Ecosystem />
        <ProductsB />
        <FinalCta />
      </main>
      <Footer />
      <DirectionSwitcher current="b" />
    </>
  );
}
