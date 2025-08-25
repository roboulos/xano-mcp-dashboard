'use client';

import Link from 'next/link';

import { FileX, ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFoundPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FileX className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <CardTitle className="text-center text-3xl">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Oops! This page doesn't exist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            The page you're looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <div className="mt-6 space-y-2">
            <p className="text-muted-foreground text-center text-sm">
              Popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/dashboard">
                <Button variant="link" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/users">
                <Button variant="link" size="sm">
                  Users
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="link" size="sm">
                  Settings
                </Button>
              </Link>
              <Link href="/dashboard/developers">
                <Button variant="link" size="sm">
                  Developers
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
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
