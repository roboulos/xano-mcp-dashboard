/**
 * XanoClient - Direct client for Xano API calls
 * Replaces the double-hop pattern of Component → Next.js API → Xano
 * with direct Component → Xano communication
 */

import { authStorage } from '@/utils/auth-storage';

interface XanoConfig {
  credentialsManagement: {
    baseUrl: string;
    apiKey: string;
  };
  authManagement: {
    baseUrl: string;
    apiKey: string;
  };
  dashboardAnalytics: {
    baseUrl: string;
    apiKey: string;
  };
  billingManagement: {
    baseUrl: string;
    apiKey: string;
  };
}

// Xano API configuration
const XANO_CONFIG: XanoConfig = {
  credentialsManagement: {
    baseUrl: 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r',
    apiKey: 'Etd0xY9r',
  },
  authManagement: {
    baseUrl: 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3',
    apiKey: 'e6emygx3',
  },
  dashboardAnalytics: {
    baseUrl: 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_',
    apiKey: 'ZVMx4ul_',
  },
  billingManagement: {
    baseUrl: 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU',
    apiKey: 'uBjgCRGU',
  },
};

class XanoClient {
  private getAuthToken(): string | null {
    return authStorage.getToken();
  }

  private async request<T>(
    apiGroup: keyof XanoConfig,
    endpoint: string,
    options: RequestInit & { skipAuth?: boolean } = {}
  ): Promise<T> {
    const config = XANO_CONFIG[apiGroup];
    const url = `${config.baseUrl}${endpoint}`;

    const authToken = this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available and not explicitly skipped
    if (authToken && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.group(`🔵 Xano API: ${apiGroup} ${endpoint}`);
      // eslint-disable-next-line no-console
      console.log('URL:', url);
      // eslint-disable-next-line no-console
      console.log('Method:', options.method || 'GET');
      if (options.body) {
        // eslint-disable-next-line no-console
        console.log('Payload:', JSON.parse(options.body as string));
      }
      // eslint-disable-next-line no-console
      console.log('Auth:', authToken ? '✅ Token present' : '❌ No token');
    }

    const startTime = Date.now();
    const response = await fetch(url, {
      ...options,
      headers,
    });
    const duration = Date.now() - startTime;

    // Clone response for logging
    const responseData = await response.json();

    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(
        response.ok ? '✅ Success' : '❌ Error',
        `(${response.status}) - ${duration}ms`
      );
      // eslint-disable-next-line no-console
      console.log('Response:', responseData);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    if (!response.ok) {
      throw new Error(
        `Xano API error: ${response.status} ${response.statusText}`
      );
    }

    return responseData;
  }

  // Authentication endpoints
  auth = {
    signup: async (data: {
      first_name: string;
      last_name: string;
      company: string;
      email: string;
      password: string;
      invitation_token?: string;
    }) => {
      return this.request('authManagement', '/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true, // No auth required for signup
      });
    },

    login: async (email: string, password: string) => {
      return this.request('authManagement', '/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true, // No auth required for login
      });
    },

    me: async () => {
      return this.request('authManagement', '/auth/me');
    },

    updateProfile: async (data: {
      name?: string;
      first_name?: string;
      last_name?: string;
      company?: string;
      avatar_url?: string;
    }) => {
      // Convert undefined to empty strings for proper handling in Xano
      const payload = {
        name: data.name ?? '',
        first_name: data.first_name ?? '',
        last_name: data.last_name ?? '',
        company: data.company ?? '',
        avatar_url: data.avatar_url ?? '',
      };

      return this.request('authManagement', '/auth/update-profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },

    saveApiKey: async (apiKey: string) => {
      return this.request('authManagement', '/save_api_key', {
        method: 'POST',
        body: JSON.stringify({ api_key: apiKey }),
      });
    },
  };

  // Credentials Management endpoints
  credentials = {
    list: async () => {
      return this.request('credentialsManagement', '/xano-credentials/list');
    },

    create: async (credential_name: string, xano_api_key: string) => {
      return this.request('credentialsManagement', '/xano-credentials/create', {
        method: 'POST',
        body: JSON.stringify({ credential_name, xano_api_key }),
      });
    },

    delete: async (id: number) => {
      return this.request('credentialsManagement', '/xano-credentials/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
    },

    setDefault: async (id: number) => {
      return this.request(
        'credentialsManagement',
        '/xano-credentials/set-default',
        {
          method: 'PUT',
          body: JSON.stringify({ id }),
        }
      );
    },

    update: async (
      id: number,
      updates: {
        credential_name?: string;
        workspace_id?: number;
        branch?: string;
      }
    ) => {
      return this.request('credentialsManagement', '/xano-credentials/update', {
        method: 'PATCH',
        body: JSON.stringify({ id, ...updates }),
      });
    },

    validate: async (id: number) => {
      return this.request('credentialsManagement', '/validate', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
    },

    getActive: async () => {
      return this.request(
        'credentialsManagement',
        '/xano-credentials/get-active'
      );
    },
  };

  // Dashboard Analytics endpoints
  analytics = {
    mcpMetrics: {
      summary: async (period: string, timezone: string) => {
        return this.request(
          'dashboardAnalytics',
          `/mcp-metrics/real-summary?period=${period}&timezone=${timezone}`
        );
      },

      performance: async (period: string) => {
        return this.request(
          'dashboardAnalytics',
          `/mcp-metrics/performance?period=${period}`
        );
      },

      trends: async (period: string, compare: boolean = true) => {
        return this.request(
          'dashboardAnalytics',
          `/mcp-metrics/trends?period=${period}&compare=${compare}`
        );
      },

      errors: async () => {
        return this.request('dashboardAnalytics', '/mcp-metrics/errors');
      },

      toolMetrics: async (toolName: string, days: number = 7) => {
        return this.request(
          'dashboardAnalytics',
          `/mcp-metrics/tool/${toolName}?days=${days}`
        );
      },

      export: async (days: number = 30) => {
        return this.request(
          'dashboardAnalytics',
          `/mcp-metrics/export?days=${days}`
        );
      },
    },

    dailyMetrics: async () => {
      return this.request('dashboardAnalytics', '/daily-metrics');
    },

    activityFeed: async (limit: number = 50) => {
      return this.request(
        'dashboardAnalytics',
        `/activity-feed?limit=${limit}`
      );
    },

    mcpLogs: {
      cleanup: async (daysToKeep: number, dryRun: boolean = true) => {
        return this.request('dashboardAnalytics', '/mcp-logs/cleanup', {
          method: 'POST',
          body: JSON.stringify({ days_to_keep: daysToKeep, dry_run: dryRun }),
        });
      },
    },

    log: async (logData: Record<string, unknown>) => {
      return this.request('credentialsManagement', '/mcp-log', {
        method: 'POST',
        body: JSON.stringify(logData),
      });
    },
  };

  // Billing Management endpoints
  billing = {
    plans: async () => {
      // This endpoint doesn't require auth
      return this.request('billingManagement', '/billing/plans', {
        skipAuth: true, // Public endpoint
      });
    },

    subscribe: async (
      priceId: string,
      successUrl: string,
      cancelUrl: string
    ) => {
      return this.request('billingManagement', '/billing/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          price_id: priceId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });
    },

    subscription: async () => {
      return this.request('billingManagement', '/billing/subscription');
    },

    cancel: async (reason?: string) => {
      return this.request('billingManagement', '/billing/cancel', {
        method: 'POST',
        body: JSON.stringify({ reason: reason || '' }),
      });
    },

    reactivate: async (planTier: string) => {
      return this.request('billingManagement', '/billing/reactivate', {
        method: 'POST',
        body: JSON.stringify({ plan_tier: planTier }),
      });
    },

    upgrade: async (newPlanTier: string, priceId: string) => {
      return this.request('billingManagement', '/billing/upgrade', {
        method: 'PUT',
        body: JSON.stringify({ new_plan_tier: newPlanTier, price_id: priceId }),
      });
    },

    invoices: async (page: number = 1, perPage: number = 10) => {
      return this.request(
        'billingManagement',
        `/billing/invoices?page=${page}&per_page=${perPage}`
      );
    },

    paymentMethods: {
      list: async () => {
        return this.request('billingManagement', '/billing/payment-methods');
      },

      add: async (data: {
        payment_method_id: string;
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
      }) => {
        return this.request('billingManagement', '/billing/payment-methods', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },

      delete: async (id: string) => {
        return this.request(
          'billingManagement',
          `/billing/payment-methods/${id}`,
          {
            method: 'DELETE',
            body: JSON.stringify({ id }),
          }
        );
      },
    },

    usage: async () => {
      return this.request('billingManagement', '/billing/usage');
    },

    quotaStatus: async () => {
      return this.request('billingManagement', '/billing/quota-status');
    },

    stripeWebhook: async (type: string, data: Record<string, unknown>) => {
      // This endpoint doesn't require auth (webhook from Stripe)
      return this.request('billingManagement', '/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify({ type, data }),
        skipAuth: true, // Webhook endpoint
      });
    },
  };

  // Workspace management (from workspace 5)
  workspace = {
    members: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      list: async (_workspaceId: number = 5) => {
        // TODO: This endpoint needs to be discovered in the Xano workspace
        // For now, return empty array
        return { items: [] };
      },
    },
  };
}

// Export singleton instance
export const xanoClient = new XanoClient();

// Export types
export type { XanoConfig };
