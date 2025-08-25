'use client';

import { Database, Shield, Server } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function XanoCredentialsForm() {
  return (
    <>
      <div className="text-muted-foreground mb-6 text-start text-sm font-medium tracking-tight">
        <p className="mb-2">
          Connect your Xano workspace to enable AI-powered backend
          development through any AI assistant.
        </p>
        <p>
          Your credentials are encrypted and stored securely. OAuth 2.0
          ensures secure access to your workspace.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Xano Workspace Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hostname">Workspace URL</Label>
                <Input
                  id="hostname"
                  placeholder="your-app.xano.io"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">API Version</Label>
                <Input id="port" placeholder="v1" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Instance ID</Label>
              <Input id="database" placeholder="DEMO" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account Path</Label>
              <Input id="account" placeholder="/usr/accounts/DEMO" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="mcpuser" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connection-string">
                Connection String (Optional)
              </Label>
              <Textarea
                id="connection-string"
                placeholder="Custom connection parameters or override settings"
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Production Database - Sales Data"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Test Connection</Button>
          <Button>Save Credentials</Button>
        </div>
      </div>
    </>
  );
}
