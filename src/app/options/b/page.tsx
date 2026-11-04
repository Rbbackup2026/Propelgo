import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Ecosystem } from "@/components/home/Ecosystem";
import { ExperienceStats } from "@/components/home/Overview";
import { Leadership } from "@/components/home/Leadership";
import { Products } from "@/components/home/Products";
import { Capabilities } from "@/components/home/Capabilities";
import { Security } from "@/components/home/Security";
import { Testimonials } from "@/components/home/Testimonials";
import { Resources } from "@/components/home/Resources";
import { FinalCta } from "@/components/home/FinalCta";
import { DirectionSwitcher } from "@/components/options/DirectionSwitcher";
import { HeroB } from "@/components/options/b/HeroB";

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
        <ExperienceStats />
        <Products />
        <Capabilities />
        <Leadership />
        <Security />
        <Testimonials />
        <Resources />
        <FinalCta tone="spectrum" />
      </main>
      <Footer ribbon="twist" />
      <DirectionSwitcher current="b" />
    </>
  );
}
