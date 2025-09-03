'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/auth-context';

export interface ActivityEvent {
  id: string;
  type: 'database' | 'api' | 'function' | 'task' | 'auth' | 'system';
  action: string;
  description: string;
  userFriendlyDescription: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning' | 'info';
  metadata: {
    endpoint?: string;
    table?: string;
    recordsAffected?: number;
    responseTime?: number;
    errorCode?: string;
    errorMessage?: string;
    relatedResources?: string[];
    tool?: string;
    callCount?: number;
    errorCount?: number;
    avgResponseTime?: number;
    totalDuration?: number;
  };
  impact: 'low' | 'medium' | 'high';
}

interface ActivityFeedResponse {
  events: ActivityEvent[];
  pagination: {
    has_more: boolean;
    total: number;
    returned: number;
  };
}

export function useActivityFeed(limit: number = 50) {
  const [data, setData] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/activity-feed?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${user.authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch activity feed');
        }

        const result: ActivityFeedResponse = await response.json();

        // Transform the events to ensure proper date handling
        const transformedEvents = result.events.map(event => ({
          ...event,
          // Convert timestamp from milliseconds to Date object
          timestamp: new Date(Number(event.timestamp)),
          userName: event.userName || 'System',
          userAvatar:
            event.userAvatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${event.userId}`,
        }));

        setData(transformedEvents);
        setHasMore(result.pagination.has_more);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [limit, user]);

  return {
    data,
    loading,
    error,
    hasMore,
    refetch: () => window.location.reload(),
  };
}
