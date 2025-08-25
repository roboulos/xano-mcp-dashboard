import { ThemeSwitch } from '@/components/theme-switch';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header
      className={cn(
        'bg-background z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4',
        'sticky top-0'
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex w-full justify-end">
        <ThemeSwitch />
      </div>
    </header>
  );
}
