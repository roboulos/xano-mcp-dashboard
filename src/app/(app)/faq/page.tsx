import React from 'react';

import { DashedLine } from '@/components/dashed-line';
import CreamContainer from '@/components/layout/cream-container';
import { FAQ } from '@/components/sections/faq';
import { Testimonials } from '@/components/sections/testimonials';

const Page = () => {
  return (
    <CreamContainer>
      <FAQ
        className="py-28 text-center lg:pt-44 lg:pb-32"
        className2="max-w-xl lg:grid-cols-1"
        headerTag="h1"
      />
      <DashedLine className="mx-auto max-w-xl" />
      <Testimonials dashedLineClassName="hidden" />
    </CreamContainer>
  );
};

export default Page;
