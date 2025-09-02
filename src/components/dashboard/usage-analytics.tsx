'use client';

import { useState } from 'react';

import {
  MapPinIcon,
  UsersIcon,
  ShieldAlertIcon,
  GlobeIcon,
  DownloadIcon,
  AlertTriangleIcon,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock login location data
const loginLocations = [
  {
    id: '1',
    user: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'New York, USA',
    country: 'US',
    lat: 40.7128,
    lng: -74.006,
    lastLogin: new Date('2024-01-07T14:23:00'),
    ipAddress: '192.168.1.101',
    device: 'Chrome on MacOS',
    logins: 23,
  },
  {
    id: '2',
    user: 'Michael Chen',
    email: 'michael@example.com',
    location: 'San Francisco, USA',
    country: 'US',
    lat: 37.7749,
    lng: -122.4194,
    lastLogin: new Date('2024-01-07T12:45:00'),
    ipAddress: '192.168.1.102',
    device: 'Safari on MacOS',
    logins: 45,
  },
  {
    id: '3',
    user: 'Emily Rodriguez',
    email: 'emily@example.com',
    location: 'London, UK',
    country: 'GB',
    lat: 51.5074,
    lng: -0.1278,
    lastLogin: new Date('2024-01-07T09:15:00'),
    ipAddress: '192.168.1.103',
    device: 'Firefox on Windows',
    logins: 12,
  },
  {
    id: '4',
    user: 'David Park',
    email: 'david@example.com',
    location: 'Seoul, South Korea',
    country: 'KR',
    lat: 37.5665,
    lng: 126.978,
    lastLogin: new Date('2024-01-07T18:30:00'),
    ipAddress: '192.168.1.104',
    device: 'Edge on Windows',
    logins: 8,
  },
];

// Check for suspicious logins (multiple locations for same user)
const checkSuspiciousLogins = () => {
  const userLocations = loginLocations.reduce(
    (acc, login) => {
      if (!acc[login.email]) acc[login.email] = [];
      acc[login.email].push(login.location);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const suspicious = Object.entries(userLocations)
    .filter(([, locations]) => new Set(locations).size > 1)
    .map(([email]) => email);

  return suspicious;
};

interface UsageAnalyticsProps {
  className?: string;
}

export default function UsageAnalytics({ className }: UsageAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('24h');
  const { toast } = useToast();
  const suspiciousUsers = checkSuspiciousLogins();

  const handleExport = () => {
    toast({
      title: 'Exporting login data',
      description: 'Your login location report is being generated...',
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Login Security</h2>
          <p className="text-muted-foreground">
            Monitor team login locations and detect suspicious activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Security Alert */}
      {suspiciousUsers.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>
            {suspiciousUsers.length} user(s) have logged in from multiple
            locations. This could indicate account sharing or compromised
            credentials.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <UsersIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loginLocations.reduce((sum, l) => sum + l.logins, 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              Across {loginLocations.length} users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <GlobeIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(loginLocations.map(l => l.country)).size}
            </div>
            <p className="text-muted-foreground text-xs">Unique locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <MapPinIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                loginLocations.filter(
                  l => Date.now() - l.lastLogin.getTime() < 30 * 60 * 1000
                ).length
              }
            </div>
            <p className="text-muted-foreground text-xs">In the last 30 min</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Issues
            </CardTitle>
            <ShieldAlertIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {suspiciousUsers.length}
            </div>
            <p className="text-muted-foreground text-xs">
              Multi-location logins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Map Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            Login Locations Map
          </CardTitle>
          <CardDescription>
            Current team member locations based on their last login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/20 relative h-[400px] w-full overflow-hidden rounded-lg">
            {/* Simple world map visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-full w-full max-w-4xl">
                {/* Map placeholder - in production you'd use a real map library */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  {/* Map dots for each location */}
                  {loginLocations.map(location => {
                    // Simple positioning based on lat/lng
                    const x = ((location.lng + 180) / 360) * 100;
                    const y = ((90 - location.lat) / 180) * 100;

                    return (
                      <div
                        key={location.id}
                        className="group absolute"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="relative">
                          <div className="bg-primary/20 absolute -inset-2 animate-ping rounded-full" />
                          <div className="bg-primary border-background relative h-3 w-3 rounded-full border-2 shadow-lg" />
                          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="bg-popover text-popover-foreground rounded-lg p-3 text-sm whitespace-nowrap shadow-lg">
                              <p className="font-semibold">{location.user}</p>
                              <p className="text-muted-foreground text-xs">
                                {location.location}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {location.device}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
          <CardDescription>
            Detailed information about team member logins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Total Logins</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loginLocations.map(login => (
                  <tr key={login.id} className="border-b">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{login.user}</p>
                        <p className="text-muted-foreground text-xs">
                          {login.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="text-muted-foreground h-4 w-4" />
                        <div>
                          <p>{login.location}</p>
                          <p className="text-muted-foreground text-xs">
                            {login.ipAddress}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs">
                        {login.lastLogin.toLocaleDateString()}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {login.lastLogin.toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs">{login.device}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{login.logins}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {suspiciousUsers.includes(login.email) ? (
                        <Badge variant="destructive" className="gap-1">
                          <ShieldAlertIcon className="h-3 w-3" />
                          Multiple Locations
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600">
                          Secure
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
