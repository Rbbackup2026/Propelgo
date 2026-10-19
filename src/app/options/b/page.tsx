import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Overview } from "@/components/home/Overview";
import { Products } from "@/components/home/Products";
import { CapabilitiesB } from "@/components/options/CapabilitiesB";
import { SecurityB } from "@/components/options/SecurityB";
import { TestimonialsB } from "@/components/options/TestimonialsB";
import { Resources } from "@/components/home/Resources";
import { FinalCta } from "@/components/home/FinalCta";
import { HeroB } from "@/components/options/HeroB";
import { EcosystemB } from "@/components/options/EcosystemB";
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
        <EcosystemB />
        <Overview featured="rings" tone="brand" />
        <Products tone="brand" />
        <CapabilitiesB />
        <SecurityB />
        <TestimonialsB />
        <Resources tone="brand" />
        <FinalCta />
      </main>
      <Footer />
      <DirectionSwitcher current="b" />
    </>
  );
}
