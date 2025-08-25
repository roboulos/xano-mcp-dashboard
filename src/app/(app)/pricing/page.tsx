import React from 'react';

import CreamContainer from '@/components/layout/cream-container';
import { Pricing } from '@/components/sections/pricing';
import Pricing2 from '@/components/sections/pricing2';
const Page = () => {
  return (
    <CreamContainer>
      <Pricing className="py-28 text-center lg:pt-44 lg:pb-32" />
      <Pricing2 />
    </CreamContainer>
  );
};

export default Page;
