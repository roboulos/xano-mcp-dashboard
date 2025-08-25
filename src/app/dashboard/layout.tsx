'use client';

import { useState } from 'react';

import { AppSidebar } from '@/components/layout/app-sidebar';
import SearchProvider from '@/components/search-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <SearchProvider value={{ open: searchOpen, setOpen: setSearchOpen }}>
      <div className="bg-background flex min-h-screen w-full">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <div
            id="content"
            className={cn(
              'bg-background flex min-h-screen flex-1 flex-col',
              'has-[div[data-layout=fixed]]:h-svh',
              'group-data-[scroll-locked=1]/body:h-full',
              'has-[data-layout=fixed]:group-data-[scroll-locked=1]/body:h-svh'
            )}
          >
            {children}
          </div>
        </SidebarProvider>
      </div>
    </SearchProvider>
  );
}
