import { IconLayoutDashboard } from '@tabler/icons-react';

import { type SidebarData } from '../types';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

export const sidebarData: SidebarData = {
  user: {
    name: 'Sarah Johnson',
    email: 'sarah.j@manufacturing.com',
    avatar: '/avatars/ausrobdev-avatar.png',
  },
  teams: [
    {
      name: 'Xano AI Developer Platform',
      logo: ({ className }: { className: string }) => (
        <Logo className={cn('invert dark:invert-0', className)} />
      ),
      plan: 'Free Platform',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconLayoutDashboard,
        },
      ],
    },
  ],
};
