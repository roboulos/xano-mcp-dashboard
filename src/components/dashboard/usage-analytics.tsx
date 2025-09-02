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
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
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
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const handleExportData = () => {
    const headers = ['Date', 'API Calls', 'Active Users', 'Errors'];
    const rows = dailyUsageData.map(d => [d.date, d.calls, d.users, d.errors]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usage-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data exported successfully',
      description: `Usage analytics for ${timeRange} has been downloaded.`,
    });
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
          <Card className="ring-border shadow-sm ring-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <ActivityIcon className="h-4 w-4 text-blue-600" />
                Total API Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight">
                  {totalCalls.toLocaleString()}
                </p>
                <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <TrendingUpIcon className="h-4 w-4" />
                  +12.5%
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                +234 from last period
              </p>
            </CardContent>
          </Card>

          <Card className="ring-border shadow-sm ring-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <UsersIcon className="h-4 w-4 text-emerald-600" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight">
                  {totalUsers}
                </p>
                <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <TrendingUpIcon className="h-4 w-4" />
                  +8.3%
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                +4 from last period
              </p>
            </CardContent>
          </Card>

          <Card className="ring-border shadow-sm ring-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <BarChartIcon className="h-4 w-4 text-orange-600" />
                Error Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight">
                  {errorRate}%
                </p>
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <TrendingUpIcon className="h-4 w-4 rotate-180" />
                  -2.1%
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Improved from last period
              </p>
            </CardContent>
          </Card>

          <Card className="ring-border shadow-sm ring-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <ActivityIcon className="h-4 w-4 text-purple-600" />
                Avg Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight">
                  {avgResponseTime.toFixed(0)}ms
                </p>
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <TrendingUpIcon className="h-4 w-4 rotate-180" />
                  -5.2%
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Faster than last period
              </p>
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
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={`hsl(var(--chart-${selectedMetric === 'calls' ? '1' : selectedMetric === 'users' ? '2' : '3'}))`}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={`hsl(var(--chart-${selectedMetric === 'calls' ? '1' : selectedMetric === 'users' ? '2' : '3'}))`}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={value =>
                      new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={`hsl(var(--chart-${selectedMetric === 'calls' ? '1' : selectedMetric === 'users' ? '2' : '3'}))`}
                    strokeWidth={2}
                    fill="url(#areaGradient)"
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
