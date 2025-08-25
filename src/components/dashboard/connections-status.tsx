'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const connections = [
  {
    id: 1,
    name: 'Production API',
    status: 'active',
    lastSync: '2 minutes ago',
    queries: '1,234 endpoints',
    avatar: '/avatars/db-prod.png',
  },
  {
    id: 2,
    name: 'User Management',
    status: 'active',
    lastSync: '5 minutes ago',
    queries: '892 functions',
    avatar: '/avatars/db-analytics.png',
  },
  {
    id: 3,
    name: 'Staging Workspace',
    status: 'inactive',
    lastSync: '2 hours ago',
    queries: '45 APIs',
    avatar: '/avatars/db-staging.png',
  },
  {
    id: 4,
    name: 'Development Branch',
    status: 'active',
    lastSync: '10 minutes ago',
    queries: '567 tables',
    avatar: '/avatars/db-dev.png',
  },
  {
    id: 5,
    name: 'Background Tasks',
    status: 'maintenance',
    lastSync: '1 day ago',
    queries: '12 jobs',
    avatar: '/avatars/db-backup.png',
  },
];

export function ConnectionsStatus() {
  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle>Xano Resources</CardTitle>
        <CardDescription>
          Monitor your Xano workspace resources and API activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {connections.map(connection => (
            <div key={connection.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={connection.avatar} alt={connection.name} />
                <AvatarFallback>
                  {connection.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-1 space-y-1">
                <p className="text-sm leading-none font-medium">
                  {connection.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {connection.lastSync} • {connection.queries}
                </p>
              </div>
              <Badge
                variant={
                  connection.status === 'active'
                    ? 'default'
                    : connection.status === 'inactive'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {connection.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
