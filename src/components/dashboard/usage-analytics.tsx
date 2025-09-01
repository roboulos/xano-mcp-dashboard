'use client';

import { useState } from 'react';

import {
  TrendingUpIcon,
  UsersIcon,
  ActivityIcon,
  BarChartIcon,
  CalendarIcon,
  DownloadIcon,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Mock usage data
const dailyUsageData = [
  { date: '2024-01-01', calls: 145, users: 12, errors: 3 },
  { date: '2024-01-02', calls: 234, users: 18, errors: 1 },
  { date: '2024-01-03', calls: 189, users: 15, errors: 5 },
  { date: '2024-01-04', calls: 312, users: 22, errors: 2 },
  { date: '2024-01-05', calls: 278, users: 19, errors: 4 },
  { date: '2024-01-06', calls: 401, users: 28, errors: 1 },
  { date: '2024-01-07', calls: 356, users: 25, errors: 3 },
];

const userUsageData = [
  {
    user: 'Sarah Johnson',
    calls: 1247,
    percentage: 35,
    color: 'hsl(var(--chart-1))',
  },
  {
    user: 'Michael Chen',
    calls: 934,
    percentage: 26,
    color: 'hsl(var(--chart-2))',
  },
  {
    user: 'Emily Rodriguez',
    calls: 456,
    percentage: 13,
    color: 'hsl(var(--chart-3))',
  },
  {
    user: 'David Park',
    calls: 123,
    percentage: 3,
    color: 'hsl(var(--chart-4))',
  },
  { user: 'Others', calls: 823, percentage: 23, color: 'hsl(var(--chart-5))' },
];

const endpointUsageData = [
  { endpoint: '/api/users', calls: 456, avgTime: 127 },
  { endpoint: '/api/projects', calls: 234, avgTime: 89 },
  { endpoint: '/api/analytics', calls: 189, avgTime: 245 },
  { endpoint: '/api/auth', calls: 167, avgTime: 45 },
  { endpoint: '/api/files', calls: 134, avgTime: 156 },
  { endpoint: '/api/notifications', calls: 89, avgTime: 67 },
];

const peakHoursData = [
  { hour: '00', calls: 12 },
  { hour: '01', calls: 8 },
  { hour: '02', calls: 5 },
  { hour: '03', calls: 3 },
  { hour: '04', calls: 7 },
  { hour: '05', calls: 15 },
  { hour: '06', calls: 32 },
  { hour: '07', calls: 45 },
  { hour: '08', calls: 78 },
  { hour: '09', calls: 123 },
  { hour: '10', calls: 167 },
  { hour: '11', calls: 145 },
  { hour: '12', calls: 134 },
  { hour: '13', calls: 156 },
  { hour: '14', calls: 189 },
  { hour: '15', calls: 198 },
  { hour: '16', calls: 167 },
  { hour: '17', calls: 145 },
  { hour: '18', calls: 89 },
  { hour: '19', calls: 67 },
  { hour: '20', calls: 45 },
  { hour: '21', calls: 34 },
  { hour: '22', calls: 23 },
  { hour: '23', calls: 16 },
];

interface UsageAnalyticsProps {
  className?: string;
}

export default function UsageAnalytics({ className }: UsageAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>(
    '7d'
  );
  const [selectedMetric, setSelectedMetric] = useState<
    'calls' | 'users' | 'errors'
  >('calls');

  const handleExportData = () => {
    // Simulate data export
    // Exporting analytics data...
  };

  const totalCalls = dailyUsageData.reduce((sum, day) => sum + day.calls, 0);
  const totalUsers = Math.max(...dailyUsageData.map(day => day.users));
  const totalErrors = dailyUsageData.reduce((sum, day) => sum + day.errors, 0);
  const errorRate = ((totalErrors / totalCalls) * 100).toFixed(2);

  const avgResponseTime =
    endpointUsageData.reduce((sum, endpoint) => sum + endpoint.avgTime, 0) /
    endpointUsageData.length;
  const mostActiveHour = peakHoursData.reduce((max, hour) =>
    hour.calls > max.calls ? hour : max
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <BarChartIcon className="h-5 w-5" />
              Usage Analytics
            </CardTitle>
            <CardDescription>
              User-focused metrics and performance insights
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={timeRange}
              onValueChange={(value: string) =>
                setTimeRange(value as '24h' | '7d' | '30d' | '90d')
              }
            >
              <SelectTrigger className="w-24">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={handleExportData}>
              <DownloadIcon className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-4 w-4 text-blue-600" />
                <div className="text-2xl font-bold">
                  {totalCalls.toLocaleString()}
                </div>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Total API Calls
              </p>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUpIcon className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600">
                  +12.5%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-emerald-600" />
                <div className="text-2xl font-bold">{totalUsers}</div>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Active Users</p>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUpIcon className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600">
                  +8.3%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4 text-orange-600" />
                <div className="text-2xl font-bold">{errorRate}%</div>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Error Rate</p>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUpIcon className="h-3 w-3 rotate-180 text-red-600" />
                <span className="text-xs font-medium text-emerald-600">
                  -2.1%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-4 w-4 text-purple-600" />
                <div className="text-2xl font-bold">
                  {avgResponseTime.toFixed(0)}ms
                </div>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Avg Response</p>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUpIcon className="h-3 w-3 rotate-180 text-red-600" />
                <span className="text-xs font-medium text-emerald-600">
                  -5.2%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Trend Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Usage Trends</CardTitle>
              <Select
                value={selectedMetric}
                onValueChange={(value: string) =>
                  setSelectedMetric(value as 'users' | 'calls' | 'errors')
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calls">API Calls</SelectItem>
                  <SelectItem value="users">Active Users</SelectItem>
                  <SelectItem value="errors">Error Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                [selectedMetric]: {
                  label:
                    selectedMetric === 'calls'
                      ? 'API Calls'
                      : selectedMetric === 'users'
                        ? 'Users'
                        : 'Errors',
                  color:
                    selectedMetric === 'calls'
                      ? 'hsl(var(--chart-1))'
                      : selectedMetric === 'users'
                        ? 'hsl(var(--chart-2))'
                        : 'hsl(var(--chart-3))',
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyUsageData}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={value =>
                      new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={`hsl(var(--chart-${selectedMetric === 'calls' ? '1' : selectedMetric === 'users' ? '2' : '3'}))`}
                    fill={`hsl(var(--chart-${selectedMetric === 'calls' ? '1' : selectedMetric === 'users' ? '2' : '3'}))`}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Usage Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage by Team Member</CardTitle>
              <CardDescription>
                API calls distribution across team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userUsageData.map(user => (
                  <div
                    key={user.user}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: user.color }}
                      />
                      <span className="text-sm font-medium">{user.user}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">
                          {user.calls.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {user.percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Peak Usage Hours</CardTitle>
              <CardDescription>
                API call patterns throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  calls: {
                    label: 'API Calls',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <XAxis
                      dataKey="hour"
                      tickFormatter={value => `${value}:00`}
                    />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      labelFormatter={value =>
                        `${value}:00 - ${parseInt(value) + 1}:00`
                      }
                    />
                    <Bar
                      dataKey="calls"
                      fill="hsl(var(--chart-1))"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Popular Endpoints</CardTitle>
            <CardDescription>
              API endpoints ranked by usage and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {endpointUsageData.map((endpoint, index) => (
                <div
                  key={endpoint.endpoint}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <code className="font-mono text-sm">
                      {endpoint.endpoint}
                    </code>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="font-semibold">
                        {endpoint.calls.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">calls</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'font-semibold',
                          endpoint.avgTime < 100
                            ? 'text-emerald-600'
                            : endpoint.avgTime < 200
                              ? 'text-orange-600'
                              : 'text-red-600'
                        )}
                      >
                        {endpoint.avgTime}ms
                      </p>
                      <p className="text-muted-foreground text-xs">avg time</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-600">💡</div>
              <div>
                <h3 className="font-semibold text-blue-900">Key Insights</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>
                    • Peak usage is at {mostActiveHour.hour}:00 with{' '}
                    {mostActiveHour.calls} calls
                  </li>
                  <li>• Sarah Johnson accounts for 35% of all API usage</li>
                  <li>
                    • Error rate decreased by 2.1% compared to last period
                  </li>
                  <li>
                    • /api/analytics endpoint has the highest response time
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
