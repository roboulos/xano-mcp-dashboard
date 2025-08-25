'use client';

import Link from 'next/link';

import { Wrench, RefreshCw, Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function MaintenancePage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
            <Wrench className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-center text-3xl">
            503 - Under Maintenance
          </CardTitle>
          <CardDescription className="text-center text-lg">
            We'll be back soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            We're performing scheduled maintenance to improve your experience.
            This usually takes less than an hour.
          </p>
          <div className="mt-6 space-y-3">
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <span className="text-sm font-medium">Expected downtime:</span>
              <span className="text-muted-foreground text-sm">~30 minutes</span>
            </div>
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <span className="text-sm font-medium">Started at:</span>
              <span className="text-muted-foreground text-sm">2:00 PM UTC</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Again
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            <Bell className="mr-1 inline h-3 w-3" />
            Follow{' '}
            <Link href="/status" className="text-primary hover:underline">
              @universestatus
            </Link>{' '}
            for updates
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
