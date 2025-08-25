'use client';

import Link from 'next/link';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ErrorPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-center text-3xl">
            500 - Server Error
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Something went wrong
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            We're experiencing technical difficulties. Our team has been
            notified and is working on a fix. Please try again later.
          </p>
          <div className="bg-muted mt-6 rounded-lg p-4">
            <p className="text-center font-mono text-sm">
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
