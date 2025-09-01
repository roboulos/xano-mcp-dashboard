'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
  title?: string;
  filename?: string;
}

export function CodeBlock({
  code,
  language = 'json',
  className,
  showCopy = true,
  title,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('group relative', className)}>
      {(title || filename) && (
        <div className="bg-muted/50 flex items-center justify-between rounded-t-lg border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-sm">
              {filename || title}
            </span>
            {filename && (
              <Badge variant="outline" className="text-xs">
                {language}
              </Badge>
            )}
          </div>
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}
      <div className="relative">
        <pre
          className={cn(
            'overflow-x-auto bg-slate-900 p-4 font-mono text-sm text-slate-100 dark:bg-slate-950 dark:text-slate-200',
            title ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'
          )}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
        {showCopy && !title && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-70 transition-opacity group-hover:opacity-100 hover:opacity-100"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
