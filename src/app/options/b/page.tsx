import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Overview } from "@/components/home/Overview";
import { Products } from "@/components/home/Products";
import { Capabilities } from "@/components/home/Capabilities";
import { Security } from "@/components/home/Security";
import { Testimonials } from "@/components/home/Testimonials";
import { Resources } from "@/components/home/Resources";
import { FinalCta } from "@/components/home/FinalCta";
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
        <Hero stage="dashboard" />
        <Ecosystem />
        <Overview />
        <Products />
        <Capabilities />
        <Security />
        <Testimonials />
        <Resources />
        <FinalCta tone="spectrum" />
      </main>
      <Footer />
      <DirectionSwitcher current="b" />
    </>
  );
}
