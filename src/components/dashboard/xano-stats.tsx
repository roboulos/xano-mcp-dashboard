'use client';

import { Database, Calendar, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function XanoStats() {
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Xano Connection</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
            Not Connected
          </div>
          <p className="mb-2 text-xs text-amber-700 dark:text-amber-300">
            Connect your Xano workspace to get started
          </p>
          <Button size="sm" asChild>
            <a href="/dashboard">Connect Now</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Developer</CardTitle>
          <Database className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Ready</div>
          <p className="text-muted-foreground text-xs">
            Works with Claude.ai, ChatGPT, Copilot
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Demo</CardTitle>
          <Calendar className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Available</div>
          <p className="text-muted-foreground mb-2 text-xs">
            See AI build in action
          </p>
          <Button size="sm" variant="outline" asChild>
            <a
              href="https://calendly.com/robertboulos/30-min"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Now
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
