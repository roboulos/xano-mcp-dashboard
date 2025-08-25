'use client';

import { useEffect, useRef } from 'react';

import Lenis from 'lenis';

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const rafRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Remove native smooth scrolling which conflicts with Lenis
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    const lenis = new Lenis({
      duration: 1.2, // Slower, premium scroll duration
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Normal scroll speed
      touchMultiplier: 2,
      infinite: false,
      lerp: 0.1, // Smooth interpolation
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      try {
        lenis.destroy();
      } catch {
        // Ignore errors during cleanup
      }
      lenisRef.current = null;

      // Defensive cleanup to prevent stuck overflow:hidden on <html>
      document.documentElement.classList.remove(
        'lenis',
        'lenis-smooth',
        'lenis-stopped'
      );
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');

      // Restore default
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    };
  }, []);

  return <>{children}</>;
}
