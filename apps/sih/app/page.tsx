import Header from '@repo/ui/landing/Header';
import Hero from '@repo/ui/landing/Hero';
import Categories from '@repo/ui/landing/Catagories';
import Growth from '@repo/ui/landing/Growth';
import TopPicks from '@repo/ui/landing/TopPicks';
import Pricing from '@repo/ui/landing/Pricing';
import Journey from '@repo/ui/landing/Journey';
import Testimonials from '@repo/ui/landing/Testimonials';
import Blog from '@repo/ui/landing/Blog';
import FAQ from '@repo/ui/landing/FAQ';
import CTA from '@repo/ui/landing/CTA';
import Footer from '@repo/ui/landing/Footer';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero />
      <Categories />
      <Growth />
      <TopPicks />
      <Pricing />
      <Journey />
      <Testimonials />
      <Blog />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}