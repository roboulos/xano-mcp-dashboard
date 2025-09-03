'use client';

import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '@/contexts/auth-context';

// Types based on Xano workspace 5 API responses
export interface DashboardMetrics {
  period: string;
  total_calls: number;
  success_rate: number;
  error_count: number;
  avg_response_time: number;
  tool_stats: Record<
    string,
    {
      calls: number;
      errors: number;
      success: number;
      duration: number;
    }
  >;
  time_range: {
    start: number;
    end: number;
  };
}

export interface XanoCredential {
  id: number;
  credential_name: string;
  xano_instance_name?: string;
  xano_instance_email?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  last_validated?: string;
}

export interface WorkspaceMember {
  id: number;
  workspace_id: number;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  mcp_tools_access?: string[];
  invited_by?: string;
  invitation_token?: string;
  invitation_expires?: number;
  created_at: number;
  updated_at?: number;
  assigned_credential_id?: number;
  credential_ref?: number;
}

export interface DailyMetrics {
  calls_today: number;
}

export interface PerformanceMetrics {
  period: string;
  performance: {
    total_calls: number;
    total_duration_ms: number;
    avg_response_time_ms: number;
    fastest_tool: { name: string; avg_ms: number };
    slowest_tool: { name: string; avg_ms: number };
  };
  time_range: {
    start: number;
    end: number;
  };
}

export interface TrendsData {
  period: string;
  current_period: {
    start: number;
    end: number;
    total_calls: number;
    total_errors: number;
    unique_tools: number;
  };
  comparison: {
    enabled: boolean;
    previous_calls: number;
    previous_errors: number;
    call_growth_percent: number;
    error_change_percent: number;
  };
  top_tools: Array<{
    name: string;
    calls: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Custom hooks for fetching real data
export function useDashboardMetrics(period: string = 'week') {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await fetch(
          `/api/dashboard/mcp-metrics/summary?period=${period}&timezone=${timezone}`,
          {
            headers: {
              Authorization: `Bearer ${user.authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [period, user]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

export function useDailyMetrics() {
  const [data, setData] = useState<DailyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDailyMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/mcp-metrics/daily', {
          headers: {
            Authorization: `Bearer ${user.authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch daily metrics');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMetrics();
  }, [user]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

export function useXanoCredentials() {
  const [data, setData] = useState<XanoCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCredentials = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch('/api/mcp/credentials', {
        headers: {
          Authorization: `Bearer ${user.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credentials');
      }

      const result = await response.json();
      setData(result.items || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchCredentials();
  }, [user, fetchCredentials]);

  const createCredential = async (
    credentialName: string,
    xanoApiKey: string
  ) => {
    if (!user) throw new Error('Not authenticated');

    const response = await fetch('/api/mcp/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.authToken}`,
      },
      body: JSON.stringify({
        credential_name: credentialName,
        xano_api_key: xanoApiKey,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create credential');
    }

    const result = await response.json();
    // Refetch the list
    await fetchCredentials();
    return result;
  };

  const deleteCredential = async (id: number) => {
    if (!user) throw new Error('Not authenticated');

    const response = await fetch(`/api/mcp/credentials/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete credential');
    }

    // Refetch the list
    await fetchCredentials();
  };

  const validateCredential = async (id: number) => {
    if (!user) throw new Error('Not authenticated');

    const response = await fetch(`/api/mcp/credentials/${id}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.authToken}`,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate credential');
    }

    return await response.json();
  };

  return {
    data,
    loading,
    error,
    createCredential,
    deleteCredential,
    validateCredential,
    refetch: fetchCredentials,
  };
}

export function usePerformanceMetrics(period: string = 'week') {
  const [data, setData] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/mcp-metrics/performance?period=${period}`,
          {
            headers: {
              Authorization: `Bearer ${user.authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch performance metrics');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [period, user]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

export function useTrendsData(period: string = 'week') {
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/mcp-metrics/trends?period=${period}&compare=true`,
          {
            headers: {
              Authorization: `Bearer ${user.authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch trends data');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [period, user]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

// New hook for workspace members management
export function useWorkspaceMembers(workspaceId: number = 5) {
  const [data, setData] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMembers = useCallback(async () => {
    if (!user || !workspaceId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/workspace/${workspaceId}/members`, {
        headers: {
          Authorization: `Bearer ${user.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspace members');
      }

      const result = await response.json();
      setData(result.items || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user, workspaceId]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchMembers();
  }, [user, fetchMembers]);

  const assignMemberToCredential = async (
    credentialId: number,
    memberId: number
  ) => {
    if (!user) throw new Error('Not authenticated');

    const response = await fetch(
      `/api/workspace/credentials/${credentialId}/assign-member`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.authToken}`,
        },
        body: JSON.stringify({
          member_id: memberId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to assign member to credential');
    }

    const result = await response.json();
    await fetchMembers(); // Refresh members list
    return result;
  };

  const unassignMemberFromCredential = async (
    credentialId: number,
    memberId: number
  ) => {
    if (!user) throw new Error('Not authenticated');

    const response = await fetch(
      `/api/workspace/credentials/${credentialId}/unassign-member`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.authToken}`,
        },
        body: JSON.stringify({
          member_id: memberId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to unassign member from credential');
    }

    const result = await response.json();
    await fetchMembers(); // Refresh members list
    return result;
  };

  const getAssignedMembers = async (credentialId: number) => {
    if (!user) throw new Error('Not authenticated');

    const response = await fetch(
      `/api/workspace/credentials/${credentialId}/assigned-members`,
      {
        headers: {
          Authorization: `Bearer ${user.authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch assigned members');
    }

    const result = await response.json();
    return result.items || [];
  };

  return {
    data,
    loading,
    error,
    assignMemberToCredential,
    unassignMemberFromCredential,
    getAssignedMembers,
    refetch: fetchMembers,
  };
}
