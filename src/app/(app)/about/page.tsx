import { DashedLine } from '@/components/dashed-line';
import CreamContainer from '@/components/layout/cream-container';
import About from '@/components/sections/about';
import { AboutHero } from '@/components/sections/about-hero';
import { Investors } from '@/components/sections/investors';

export default function AboutPage() {
  return (
    <CreamContainer>
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
        <div className="pt-28 lg:pt-32">
          <DashedLine className="container max-w-5xl scale-x-115" />
          <Investors />
        </div>
      </div>
    </CreamContainer>
  );
}
