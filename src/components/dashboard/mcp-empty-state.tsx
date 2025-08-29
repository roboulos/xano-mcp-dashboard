'use client';

import { Plus, Zap, Server, Key } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MCPEmptyStateProps {
  onAddConfiguration: () => void;
}

export function MCPEmptyState({ onAddConfiguration }: MCPEmptyStateProps) {
  return (
    <Card className="hover:border-primary/20 border-2 border-dashed transition-colors">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {/* Animated Icon Group */}
        <div className="relative mb-6">
          <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full" />
          <div className="from-primary/20 to-primary/10 relative rounded-full bg-gradient-to-br p-6">
            <Server className="text-primary h-12 w-12" />
          </div>

          {/* Floating icons */}
          <div className="bg-background absolute -top-2 -right-2 animate-bounce rounded-full border p-2 shadow-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="bg-background absolute -bottom-2 -left-2 animate-bounce rounded-full border p-2 shadow-sm delay-150">
            <Key className="text-primary h-4 w-4" />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-semibold">No Configurations Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Connect your Xano workspace to enable MCP tools. Add your first
          configuration to get started with powerful API integrations.
        </p>

        <Button onClick={onAddConfiguration} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Your First Configuration
        </Button>

        <div className="text-muted-foreground mt-8 grid grid-cols-3 gap-6 text-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full p-2">
              <Server className="h-4 w-4" />
            </div>
            <span>Connect Workspace</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full p-2">
              <Zap className="h-4 w-4" />
            </div>
            <span>Test Connection</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full p-2">
              <Key className="h-4 w-4" />
            </div>
            <span>Start Using MCP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
