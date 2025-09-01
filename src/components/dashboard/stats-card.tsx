import {
  IconInfoCircle,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  description: string;
  stats: number | string;
  type?: 'asc' | 'des' | 'neutral';
  sign?: 'dollar' | 'number' | 'percent' | 'none';
  profitPercentage?: number;
  profitNumber?: number | string;
  showTrend?: boolean;
}

export default function StatsCard({
  title,
  description,
  stats,
  type = 'neutral',
  sign = 'none',
  profitNumber,
  profitPercentage,
  showTrend = false,
}: Props) {
  return (
    <Card className="bg-muted h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between px-4 pt-2 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {title}
        </CardTitle>
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger>
              <IconInfoCircle className="text-muted-foreground scale-90 stroke-[1.25]" />
              <span className="sr-only">More Info</span>
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-3">
        <div className="text-lg font-bold sm:text-2xl">
          {sign === 'dollar' && '$'}
          {typeof stats === 'number' ? stats.toLocaleString() : stats}
          {sign === 'percent' && '%'}
        </div>
        {showTrend && profitPercentage !== undefined && (
          <div
            className={cn('flex items-center gap-1 text-xs font-medium', {
              'text-emerald-500': type === 'asc',
              'text-red-500': type === 'des',
              'text-muted-foreground': type === 'neutral',
            })}
          >
            {type !== 'neutral' && (
              <span className="inline-block">
                {type === 'asc' ? (
                  <IconTrendingUp size={20} />
                ) : (
                  <IconTrendingDown size={20} />
                )}
              </span>
            )}
            <span>{profitPercentage.toLocaleString()}%</span>
            {profitNumber !== undefined && (
              <span>
                ({type === 'asc' && '+'}
                {typeof profitNumber === 'number'
                  ? profitNumber.toLocaleString()
                  : profitNumber}
                )
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
