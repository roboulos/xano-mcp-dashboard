import fs from 'fs';
import path from 'path';

interface ApiDebugLog {
  timestamp: string;
  direction: 'outbound' | 'inbound';
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  response?: {
    status: number;
    statusText?: string;
    headers?: Record<string, string>;
    data: unknown;
  };
  error?: unknown;
  duration?: number;
}

class ApiDebugLogger {
  private logFile: string;
  private enabled: boolean;

  constructor() {
    // Disable all file system operations in production
    this.enabled = process.env.NODE_ENV === 'development';

    // Only set up file paths in development
    if (this.enabled) {
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      this.logFile = path.join(logsDir, 'api-debug.log');
    } else {
      this.logFile = ''; // Empty path in production
    }
  }

  private sanitizeHeaders(
    headers: Record<string, string>
  ): Record<string, string> {
    const sanitized = { ...headers };
    // Mask sensitive headers but keep enough info for debugging
    if (sanitized.Authorization) {
      const parts = sanitized.Authorization.split(' ');
      if (parts.length === 2) {
        sanitized.Authorization = `${parts[0]} ${parts[1].substring(0, 20)}...`;
      }
    }
    return sanitized;
  }

  private formatLog(log: ApiDebugLog): string {
    const separator = '='.repeat(80);
    const timestamp = new Date(log.timestamp).toLocaleString();

    let formatted = `\n${separator}\n`;
    formatted += `[${timestamp}] ${log.direction.toUpperCase()} ${log.method || ''} ${log.endpoint}\n`;
    formatted += `${separator}\n\n`;

    if (log.headers) {
      formatted += `Headers:\n${JSON.stringify(this.sanitizeHeaders(log.headers), null, 2)}\n\n`;
    }

    if (log.body) {
      formatted += `Request Body:\n${JSON.stringify(log.body, null, 2)}\n\n`;
    }

    if (log.response) {
      formatted += `Response Status: ${log.response.status} ${log.response.statusText || ''}\n`;
      if (log.response.headers) {
        formatted += `Response Headers:\n${JSON.stringify(log.response.headers, null, 2)}\n\n`;
      }
      formatted += `Response Body:\n${JSON.stringify(log.response.data, null, 2)}\n\n`;
    }

    if (log.error) {
      formatted += `Error:\n${JSON.stringify(log.error, null, 2)}\n\n`;
    }

    if (log.duration) {
      formatted += `Duration: ${log.duration}ms\n`;
    }

    return formatted;
  }

  logOutbound(
    endpoint: string,
    method: string,
    headers: Record<string, string>,
    body?: unknown
  ): void {
    if (!this.enabled) return;

    const log: ApiDebugLog = {
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      endpoint,
      method,
      headers,
      body,
    };

    try {
      fs.appendFileSync(this.logFile, this.formatLog(log));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to write to debug log:', error);
    }
  }

  logInbound(
    endpoint: string,
    status: number,
    statusText: string,
    headers: Record<string, string>,
    data: unknown,
    duration: number
  ): void {
    if (!this.enabled) return;

    const log: ApiDebugLog = {
      timestamp: new Date().toISOString(),
      direction: 'inbound',
      endpoint,
      response: {
        status,
        statusText,
        headers,
        data,
      },
      duration,
    };

    try {
      fs.appendFileSync(this.logFile, this.formatLog(log));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to write to debug log:', error);
    }
  }

  logError(endpoint: string, error: unknown, context?: unknown): void {
    if (!this.enabled) return;

    const log: ApiDebugLog = {
      timestamp: new Date().toISOString(),
      direction: 'inbound',
      endpoint,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        context,
      },
    };

    try {
      fs.appendFileSync(this.logFile, this.formatLog(log));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to write to debug log:', error);
    }
  }

  // Helper method to create a logged fetch wrapper
  createLoggedFetch() {
    return async (url: string, init?: RequestInit): Promise<Response> => {
      const startTime = Date.now();
      const method = init?.method || 'GET';
      const headers = (init?.headers as Record<string, string>) || {};
      const body = init?.body ? JSON.parse(init.body as string) : undefined;

      // Log outbound request
      this.logOutbound(url, method, headers, body);

      try {
        const response = await fetch(url, init);
        const duration = Date.now() - startTime;

        // Clone response to read body without consuming it
        const clonedResponse = response.clone();
        const responseData = await clonedResponse.json().catch(() => ({}));

        // Convert Headers object to plain object
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        // Log inbound response
        this.logInbound(
          url,
          response.status,
          response.statusText,
          responseHeaders,
          responseData,
          duration
        );

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        this.logError(url, error, { method, headers, body, duration });
        throw error;
      }
    };
  }

  // Clear the log file
  clear(): void {
    if (!this.enabled) return;

    try {
      fs.writeFileSync(this.logFile, '');
      // eslint-disable-next-line no-console
      console.log('API debug log cleared');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to clear debug log:', error);
    }
  }

  // Get the log file path
  getLogPath(): string {
    return this.logFile;
  }
}

// Export singleton instance
export const apiDebugLogger = new ApiDebugLogger();

// Export logged fetch wrapper
export const loggedFetch = apiDebugLogger.createLoggedFetch();
