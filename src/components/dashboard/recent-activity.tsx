'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const activities = [
  {
    id: 1,
    action: 'Database connection established',
    database: 'PRODUCTION',
    user: 'john.doe@company.com',
    time: '2 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    action: 'Query executed',
    database: 'DEMO',
    user: 'sarah.smith@company.com',
    time: '5 minutes ago',
    status: 'success',
  },
  {
    id: 3,
    action: 'Connection timeout',
    database: 'DEV',
    user: 'mike.jones@company.com',
    time: '12 minutes ago',
    status: 'error',
  },
  {
    id: 4,
    action: 'New user registered',
    database: 'N/A',
    user: 'alice.wilson@company.com',
    time: '1 hour ago',
    status: 'info',
  },
  {
    id: 5,
    action: 'Credentials updated',
    database: 'STAGING',
    user: 'bob.brown@company.com',
    time: '2 hours ago',
    status: 'success',
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map(activity => (
          <div
            key={activity.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">
                {activity.action}
              </p>
              <p className="text-muted-foreground text-xs">
                {activity.user} • {activity.database}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  activity.status === 'success'
                    ? 'default'
                    : activity.status === 'error'
                      ? 'destructive'
                      : 'secondary'
                }
                className="text-xs"
              >
                {activity.status}
              </Badge>
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
