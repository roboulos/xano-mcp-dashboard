'use client';

import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { xanoClient } from '@/services/xano-client';

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
  workspace_id?: number;
  branch?: string;
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
        const result = await xanoClient.analytics.mcpMetrics.summary(
          period,
          timezone
        );
        setData(result as DashboardMetrics);
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
        const result = await xanoClient.analytics.dailyMetrics();
        setData(result as DailyMetrics);
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
      const result = await xanoClient.credentials.list();
      const credentialsResult = result as { items?: XanoCredential[] };
      setData(credentialsResult.items || []);
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

    const result = await xanoClient.credentials.create(
      credentialName,
      xanoApiKey
    );
    // Refetch the list
    await fetchCredentials();
    return result;
  };

  const deleteCredential = async (id: number) => {
    if (!user) throw new Error('Not authenticated');

    await xanoClient.credentials.delete(id);
    // Refetch the list
    await fetchCredentials();
  };

  const validateCredential = async (id: number, workspace_id?: number) => {
    if (!user) throw new Error('Not authenticated');

    // Use the new endpoint when workspace_id is provided
    if (workspace_id !== undefined) {
      return await xanoClient.credentials.validateWithWorkspace(
        id,
        workspace_id
      );
    }

    return await xanoClient.credentials.validate(id, workspace_id);
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
        const result =
          await xanoClient.analytics.mcpMetrics.performance(period);
        setData(result as PerformanceMetrics);
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
        const result = await xanoClient.analytics.mcpMetrics.trends(
          period,
          true
        );
        setData(result as TrendsData);
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
    if (!user || !workspaceId || workspaceId === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await xanoClient.workspace.members.list(workspaceId);
      const membersResult = result as { items?: WorkspaceMember[] };
      setData(membersResult.items || []);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _credentialId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _memberId: number
  ) => {
    if (!user) throw new Error('Not authenticated');

    // TODO: Implement in Xano API or use existing endpoint
    // For now, simulate the assignment locally
    // console.log('Assigning member', memberId, 'to credential', credentialId);
    await fetchMembers(); // Refresh members list
    return { success: true };
  };

  const unassignMemberFromCredential = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _credentialId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _memberId: number
  ) => {
    if (!user) throw new Error('Not authenticated');

    // TODO: Implement in Xano API or use existing endpoint
    // For now, simulate the unassignment locally
    // console.log(
    //   'Unassigning member',
    //   memberId,
    //   'from credential',
    //   credentialId
    // );
    await fetchMembers(); // Refresh members list
    return { success: true };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getAssignedMembers = async (_credentialId: number) => {
    if (!user) throw new Error('Not authenticated');

    // TODO: Implement in Xano API or use existing endpoint
    // For now, return empty array
    return [];
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
