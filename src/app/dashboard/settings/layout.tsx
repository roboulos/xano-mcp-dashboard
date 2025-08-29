import {
  IconApps,
  IconChecklist,
  IconCoin,
  IconTool,
  IconUser,
} from '@tabler/icons-react';

import SidebarNav from './components/sidebar-nav';

import { Header } from '@/components/layout/header';

const sidebarNavItems = [
  // Hidden General tab
  // {
  //   title: 'General',
  //   icon: <IconTool />,
  //   href: '/dashboard/settings',
  // },
  {
    title: 'Profile',
    icon: <IconUser />,
    href: '/dashboard/settings/profile',
  },
  {
    title: 'Billing',
    icon: <IconCoin />,
    href: '/dashboard/settings/billing',
  },
  {
    title: 'Plans',
    icon: <IconChecklist />,
    href: '/dashboard/settings/plans',
  },
  {
    title: 'Connected Apps',
    icon: <IconApps />,
    href: '/dashboard/settings/connected-apps',
  },
].filter(Boolean); // Filter out any undefined items

interface Props {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: Props) {
  return (
    <>
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Update account preferences and manage integrations.
          </p>
        </div>
        <div className="flex flex-1 flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="lg:sticky lg:top-4 lg:w-1/5 lg:self-start">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 pb-8">{children}</div>
        </div>
      </div>
    </>
  );
}
