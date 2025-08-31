declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react';

  export interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>;
    children: ReactNode;
  }

  export interface MasonryProps {
    columnsCount?: number;
    gutter?: string;
    children: ReactNode;
  }

  export const ResponsiveMasonry: React.FC<ResponsiveMasonryProps>;
  export default React.FC<MasonryProps>;
}
