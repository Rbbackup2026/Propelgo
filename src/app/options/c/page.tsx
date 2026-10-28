import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Products } from "@/components/home/Products";
import { Capabilities } from "@/components/home/Capabilities";
import { Security } from "@/components/home/Security";
import { Testimonials } from "@/components/home/Testimonials";
import { Resources } from "@/components/home/Resources";
import { FinalCta } from "@/components/home/FinalCta";
import { DirectionSwitcher } from "@/components/options/DirectionSwitcher";
import { HeroC } from "@/components/options/c/HeroC";
import { EcosystemC } from "@/components/options/c/EcosystemC";
import { OverviewC } from "@/components/options/c/OverviewC";

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
        <EcosystemC />
        <OverviewC />
        <Products />
        <Capabilities />
        <Security />
        <Testimonials />
        <Resources />
        <FinalCta tone="spectrum" />
      </main>
      <Footer />
      <DirectionSwitcher current="c" />
    </>
  );
}
