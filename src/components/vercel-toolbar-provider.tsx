'use client';

import { VercelToolbar } from '@vercel/toolbar/next';

export function VercelToolbarProvider() {
  // Only show in development or when explicitly enabled
  const showToolbar = process.env.NODE_ENV === 'development' || 
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
  
  if (!showToolbar) {
    return null;
  }

  return (
    <VercelToolbar 
      showDialog={true}
      forceShow={true}
    />
  );
}