import { CTA } from '@/components/sections/cta';
import { FAQ } from '@/components/sections/faq';
import { Features } from '@/components/sections/features';
import { Footer } from '@/components/sections/footer';
import Hero from '@/components/sections/hero';
import { QuickStart } from '@/components/sections/quickstart';
import { Testimonial } from '@/components/sections/testimonial';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <QuickStart />
      <Testimonial />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
