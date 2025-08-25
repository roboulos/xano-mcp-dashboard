import {
  IconBug,
  IconError404,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconSettings,
  IconTool,
  IconUser,
} from '@tabler/icons-react';

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
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Login',
              url: '/dashboard/login',
            },
            {
              title: 'Register',
              url: '/dashboard/register',
            },
            {
              title: 'Forgot Password',
              url: '/dashboard/forgot-password',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/dashboard/401',
              icon: IconLock,
            },
            {
              title: 'Not Found',
              url: '/dashboard/404',
              icon: IconError404,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'General',
              icon: IconTool,
              url: '/dashboard/settings',
            },
            {
              title: 'Profile',
              icon: IconUser,
              url: '/dashboard/settings/profile',
            },
            {
              title: 'Xano Credentials',
              icon: IconLock,
              url: '/dashboard/settings/universe-credentials',
            },
          ],
        },
      ],
    },
  ],
};
