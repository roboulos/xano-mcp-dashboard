'use client';

import { useState } from 'react';

import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  Bot,
  Terminal,
  Crosshair,
  Link,
  Info,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface McpConnectionHubProps {
  className?: string;
}

type ConnectionType = 'claude-desktop' | 'claude-code' | 'cursor' | 'generic';
type Environment = 'production' | 'staging' | 'development';

export default function McpConnectionHub({ className }: McpConnectionHubProps) {
  const [selectedConnection, setSelectedConnection] =
    useState<ConnectionType>('claude-desktop');
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<Environment>('production');
  const [copied, setCopied] = useState(false);

  const serverUrl = 'https://xano-mcp.your-domain.com';
  const apiKey = 'xano_prod_...key-preview';

  const connectionConfigs = {
    'claude-desktop': {
      name: 'Claude Desktop',
      description: 'Configuration for Claude Desktop app',
      icon: <Bot className="h-4 w-4" />,
      format: 'json',
      content: JSON.stringify(
        {
          mcpServers: {
            'xano-mcp': {
              command: 'npx',
              args: ['-y', '@your-org/xano-mcp-server'],
              env: {
                XANO_API_KEY: apiKey,
                XANO_INSTANCE: 'your-instance.n7.xano.io',
              },
            },
          },
        },
        null,
        2
      ),
      filename: '.claude_desktop_config.json',
    },
    'claude-code': {
      name: 'Claude Code',
      description: 'Command for Claude Code CLI',
      icon: <Terminal className="h-4 w-4" />,
      format: 'command',
      content: `mcp add @your-org/xano-mcp-server \\
  --env XANO_API_KEY=${apiKey} \\
  --env XANO_INSTANCE=your-instance.n7.xano.io`,
      filename: 'claude-code-command.sh',
    },
    cursor: {
      name: 'Cursor',
      description: 'Configuration for Cursor editor',
      icon: <Crosshair className="h-4 w-4" />,
      format: 'json',
      content: JSON.stringify(
        {
          'mcp.servers': {
            'xano-mcp': {
              command: 'npx',
              args: ['-y', '@your-org/xano-mcp-server'],
              env: {
                XANO_API_KEY: apiKey,
                XANO_INSTANCE: 'your-instance.n7.xano.io',
              },
            },
          },
        },
        null,
        2
      ),
      filename: 'cursor-mcp-config.json',
    },
    generic: {
      name: 'Generic MCP',
      description: 'Generic server URL and credentials',
      icon: <Link className="h-4 w-4" />,
      format: 'text',
      content: `Server URL: ${serverUrl}
API Key: ${apiKey}
Instance: your-instance.n7.xano.io

Usage:
1. Install MCP client of choice
2. Add server with above credentials
3. Configure environment variables`,
      filename: 'mcp-connection-info.txt',
    },
  };

  const currentConfig = connectionConfigs[selectedConnection];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentConfig.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentConfig.content], {
      type: currentConfig.format === 'json' ? 'application/json' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentConfig.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Link className="h-5 w-5" />
              MCP Connection Hub
            </CardTitle>
            <CardDescription>
              One-click configuration generation for your development tools
            </CardDescription>
          </div>
          <Badge variant="secondary">Ready</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Environment Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Environment</label>
          <ToggleGroup
            type="single"
            value={selectedEnvironment}
            onValueChange={v => v && setSelectedEnvironment(v as Environment)}
            className="justify-start"
          >
            <ToggleGroupItem value="production">Production</ToggleGroupItem>
            <ToggleGroupItem value="staging">Staging</ToggleGroupItem>
            <ToggleGroupItem value="development">Development</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Tool Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Development Tool</label>
          <Tabs
            value={selectedConnection}
            onValueChange={(value) => setSelectedConnection(value as ConnectionType)}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="claude-desktop"
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Claude Desktop</span>
                <span className="sm:hidden">Claude</span>
              </TabsTrigger>
              <TabsTrigger
                value="claude-code"
                className="flex items-center gap-2"
              >
                <Terminal className="h-4 w-4" />
                <span className="hidden sm:inline">Claude Code</span>
                <span className="sm:hidden">Code</span>
              </TabsTrigger>
              <TabsTrigger value="cursor" className="flex items-center gap-2">
                <Crosshair className="h-4 w-4" />
                <span className="hidden sm:inline">Cursor</span>
                <span className="sm:hidden">Cursor</span>
              </TabsTrigger>
              <TabsTrigger value="generic" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span className="hidden sm:inline">Generic</span>
                <span className="sm:hidden">Other</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Config Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentConfig.name} Configuration</p>
              <p className="text-muted-foreground text-sm">
                {currentConfig.description}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <CodeBlock
            code={currentConfig.content}
            language={
              currentConfig.format === 'json'
                ? 'json'
                : currentConfig.format === 'command'
                  ? 'bash'
                  : 'text'
            }
            filename={currentConfig.filename}
            className="min-h-[200px]"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">4</p>
            <p className="text-muted-foreground text-xs">Active Connections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">2.3s</p>
            <p className="text-muted-foreground text-xs">Avg Setup Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-muted-foreground text-xs">Success Rate</p>
          </div>
        </div>

        {/* Quick Help */}
        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Info className="text-primary h-5 w-5" />
            <div>
              <p className="font-medium">Setup Help</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Need help with setup? Check our{' '}
                <button className="hover:text-foreground inline-flex items-center gap-1 font-medium underline">
                  documentation <ExternalLinkIcon className="h-3 w-3" />
                </button>{' '}
                or contact support.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
