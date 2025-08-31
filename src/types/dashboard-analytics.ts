// Dashboard Analytics API Types

export interface PerformanceMetrics {
  period: string;
  performance: {
    total_calls: number;
    total_duration_ms: number;
    avg_response_time_ms: number;
    fastest_tool: {
      name: string;
      avg_ms: number;
    };
    slowest_tool: {
      name: string;
      avg_ms: number;
    };
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

export interface ErrorAnalytics {
  total_errors: number;
  tools_affected: number;
  tool_breakdown: Record<string, number>;
  recent_errors: Array<{
    id: string;
    tool_name: string;
    error_message: string;
    created_at: string;
    [key: string]: string | number | boolean | null | undefined;
  }>;
}

export interface ExportData {
  data: Array<{
    date: number;
    tool_name: string;
    calls: number;
    errors: number;
    successes: number;
    avg_duration_ms: number;
    total_duration_ms: number;
  }>;
  rows: number;
  period: {
    days: number;
    start: number;
    end: number;
  };
}

export interface ToolMetrics {
  tool_name: string;
  period: {
    start: number;
    end: number;
    days: number;
  };
  summary: {
    total_calls: number;
    total_errors: number;
    total_successes: number;
    success_rate: number;
    error_rate: number;
    avg_duration_ms: number;
  };
  time_series: Array<{
    timestamp: number;
    calls: number;
    errors: number;
    successes: number;
    avg_duration: number;
  }>;
  records_found: number;
}

export interface CleanupResponse {
  dry_run: boolean;
  days_to_keep: number;
  cutoff_date: number;
  logs_found: number;
  total_size_bytes: number;
  deleted_count: number;
  message: string;
}
