
import Header from '@repo/ui/landing/Header';
import Hero from '@repo/ui/landing/Hero';
import Pillars from '@repo/ui/landing/Pillars';
import Features from '@repo/ui/landing/Features';
import HowItWorks from '@repo/ui/landing/HowItWorks';
import Growth from '@repo/ui/landing/Growth';
import Testimonials from '@repo/ui/landing/Testimonials';
import FAQ from '@repo/ui/landing/FAQ';
import CTA from '@repo/ui/landing/CTA';
import Footer from '@repo/ui/landing/Footer';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero />
      <Pillars />
      <Features />
      <HowItWorks />
      <Growth />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}