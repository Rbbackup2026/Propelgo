import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroC } from "@/components/options/c/HeroC";
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
        <HeroC />
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
      {/* Review aid while the client compares directions; remove before launch. */}
      <DirectionSwitcher current="a" />
    </>
  );
}
