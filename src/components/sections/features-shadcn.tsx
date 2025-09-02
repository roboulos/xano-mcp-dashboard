'use client';

import React from 'react';

import { BadgeCheck } from 'lucide-react';

import { EvervaultCard } from '@/components/aceternity/evervault-card';
import { cn } from '@/lib/utils';

const FeaturesShadcn = () => {
  const coreFeatures = [
    'Real-Time Monitoring',
    'Seamless Integration',
    'Enterprise Security',
  ];

  return (
    <section className="w-full overflow-hidden py-32">
      <div className="container flex w-full max-w-6xl flex-col items-start justify-between lg:flex-row">
        <div className="relative flex h-full flex-col items-center justify-center gap-8 text-center lg:items-start lg:justify-start lg:text-left">
          <h1 className="w-full max-w-md text-5xl font-semibold tracking-tighter lg:text-6xl">
            Connect Claude to Xano—monitor, secure, and scale your MCP tools
          </h1>

          <div className="flex items-center gap-3">
            <span className="bg-border/70 h-px w-8" />
            <span className="text-muted-foreground/70 text-[11px] tracking-wider">
              FEATURES
            </span>
            <span className="bg-border/70 h-px flex-1" />
          </div>

          <ul className="flex flex-wrap gap-2">
            {coreFeatures.map(feature => (
              <li
                key={feature}
                className="border-border/60 bg-muted/40 text-foreground/80 rounded-full border px-3 py-1 text-xs"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-24 w-full max-w-md lg:mt-0">
          <FeatureSwitcher />
        </div>
      </div>
    </section>
  );
};

const FeatureSwitcher = () => {
  const [tab, setTab] = React.useState<'monitor' | 'integrate' | 'secure'>(
    'monitor'
  );
  return (
    <div className="border-border/60 bg-background/60 supports-[backdrop-filter]:bg-background/40 rounded-lg border backdrop-blur">
      <div className="flex gap-2 p-2" role="tablist" aria-label="Features">
        {[
          { id: 'monitor', label: 'Monitor' },
          { id: 'integrate', label: 'Integrate' },
          { id: 'secure', label: 'Secure' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as 'monitor' | 'integrate' | 'secure')}
            aria-selected={tab === t.id}
            role="tab"
            className={cn(
              'flex-1 rounded-md py-2 text-sm transition',
              tab === t.id
                ? 'bg-primary/10 text-primary border-primary/20 border'
                : 'text-muted-foreground hover:bg-muted/40'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="border-border/60 border-t">
        <div className="h-[320px] overflow-hidden sm:h-[360px] md:h-[420px] lg:h-[440px]">
          {tab === 'monitor' && <MonitorPanel />}
          {tab === 'integrate' && <IntegratePanel />}
          {tab === 'secure' && <SecurePanel />}
        </div>
      </div>
    </div>
  );
};

const MonitorPanel = () => {
  const events = [
    {
      t: '12:40:10',
      msg: 'Claude tool call: get_user (118ms) • 200',
      lvl: 'ok',
    },
    { t: '12:39:52', msg: 'MCP session started: claude-3.5', lvl: 'ok' },
    { t: '12:39:10', msg: 'Xano API: POST /orders (212ms) • 201', lvl: 'ok' },
    { t: '12:38:44', msg: 'Error rate spike • 1.8% → 3.1%', lvl: 'warn' },
  ];
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground font-mono text-xs">
          Real‑Time Monitoring
        </p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-500">
          Live
        </span>
      </div>
      <div className="ring-border/60 mb-4 h-16 w-full rounded-md bg-gradient-to-r from-emerald-500/20 to-transparent ring-1" />
      <ul className="flex-1 space-y-2 overflow-y-auto pr-1">
        {events.map((e, i) => (
          <li
            key={i}
            className="border-border/50 bg-background/50 flex items-center justify-between rounded-md border px-3 py-2 text-xs"
          >
            <span className="text-muted-foreground font-mono text-xs">
              {e.t}
            </span>
            <span
              className={
                e.lvl === 'warn' ? 'text-amber-500' : 'text-foreground/80'
              }
            >
              {e.msg}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IntegratePanel = () => {
  const code = `// Connect Claude to your Xano backend via MCP
import { createClient } from "@anthropic-ai/sdk";
import { XanoMCP } from "@xano/mcp";

const mcp = new XanoMCP({ 
  apiKey: process.env.XANO_API_KEY 
});
const claude = createClient({ 
  apiKey: process.env.CLAUDE_API_KEY 
});

await mcp.registerTool("get_user", { 
  endpoint: "/users/{id}", 
  method: "GET" 
});
await mcp.registerTool("create_order", { 
  endpoint: "/orders", 
  method: "POST" 
});

// Claude can now call your Xano APIs as tools—no glue code.`;

  return (
    <div className="flex h-full flex-col p-4">
      <p className="text-muted-foreground mb-3 font-mono text-xs">
        Seamless Integration
      </p>
      <pre className="border-border/60 bg-muted/40 flex-1 overflow-auto rounded-md border p-3 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <div className="mt-3 flex items-center justify-end">
        <button className="border-border/60 text-muted-foreground hover:bg-muted/40 rounded-md border px-2.5 py-1 text-xs">
          Copy
        </button>
      </div>
    </div>
  );
};

const SecurePanel = () => {
  const features = [
    { label: 'End-to-end Encryption', detail: 'AES-256 MCP tunnel' },
    { label: 'Key Rotation', detail: 'Automatic PFS' },
    { label: 'Access Control', detail: 'Scoped API keys + RBAC' },
    { label: 'Audit Trail', detail: 'Full tool call logging' },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <p className="text-muted-foreground mb-3 font-mono text-xs">
        Enterprise Security
      </p>

      {/* Subtle EvervaultCard integration - as an accent header */}
      <div className="border-border/60 bg-background/50 mb-4 rounded-md border p-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0">
            <EvervaultCard text="🔒" className="h-full w-full text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Secure MCP Bridge</p>
            <p className="text-muted-foreground text-xs">
              End-to-end encrypted connection between Claude and Xano
            </p>
          </div>
        </div>
      </div>

      {/* Security features list - matching MonitorPanel's style */}
      <ul className="flex-1 space-y-2 overflow-y-auto pr-1">
        {features.map((feature, i) => (
          <li
            key={i}
            className="border-border/50 bg-background/50 flex items-center justify-between rounded-md border px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-xs font-medium">{feature.label}</span>
            </div>
            <span className="text-muted-foreground text-xs">
              {feature.detail}
            </span>
          </li>
        ))}
      </ul>

      {/* Status indicators - matching MonitorPanel's live badge style */}
      <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-3">
        <div className="flex gap-2">
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-500">
            Active
          </span>
          <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] text-blue-500">
            FIPS 140-2
          </span>
        </div>
        <button className="border-border/60 text-muted-foreground hover:bg-muted/40 rounded-md border px-2.5 py-1 text-xs">
          Configure
        </button>
      </div>
    </div>
  );
};

export { FeaturesShadcn };

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'bg-emerald-100 px-1 py-0.5 font-bold text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500',
        className
      )}
    >
      {children}
    </span>
  );
};
