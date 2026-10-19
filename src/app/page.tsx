import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Overview } from "@/components/home/Overview";
import { Products } from "@/components/home/Products";
import { Capabilities } from "@/components/home/Capabilities";
import { Network } from "@/components/home/Network";
import { Security } from "@/components/home/Security";
import { Testimonials } from "@/components/home/Testimonials";
import { Resources } from "@/components/home/Resources";
import { FinalCta } from "@/components/home/FinalCta";
import { DirectionSwitcher } from "@/components/options/DirectionSwitcher";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PropelGo",
  url: "https://www.propelgo.in",
  description: "Enterprise payment infrastructure for vendor payments, commercial credit, cards and payment orchestration.",
  email: "support@propelgpayments.com",
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Ecosystem />
        <Overview />
        <Products />
        <Capabilities />
        <Network />
        <Security />
        <Testimonials />
        <Resources />
        <FinalCta />
      </main>
      <Footer />
      {/* Review aid while the client compares directions; remove before launch. */}
      <DirectionSwitcher current="a" />
    </>
  );
}
