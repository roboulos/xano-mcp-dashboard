import { CTAShadcn } from '@/components/sections/cta-shadcn';
import { FAQShadcn } from '@/components/sections/faq-shadcn';
import { FeaturesShadcn } from '@/components/sections/features-shadcn';
import { Footer } from '@/components/sections/footer';
import Hero from '@/components/sections/hero';
import { TestimonialShadcn } from '@/components/sections/testimonial-shadcn';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesShadcn />
      <TestimonialShadcn />
      <FAQShadcn />
      <CTAShadcn />
      <Footer />
    </>
  );
}
