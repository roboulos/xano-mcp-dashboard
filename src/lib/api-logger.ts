import { NextRequest } from 'next/server';

export function createRequestLogger(request: NextRequest, endpoint: string) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  return {
    async logRequest(body: unknown, response: unknown, error?: unknown) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const logEntry = {
        requestId,
        timestamp: new Date().toISOString(),
        endpoint,
        method: request.method,
        url: request.url,
        userAgent: request.headers.get('user-agent'),
        ip:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        body: this.sanitizeBody(body),
        response: this.sanitizeResponse(response),
        duration,
        error: error ? String(error) : undefined,
        status:
          response && typeof response === 'object' && 'error' in response
            ? 'error'
            : 'success',
      };

      // In production, you might want to send this to a logging service
      // For now, just log in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`[API Log] ${endpoint}:`, logEntry);
      }

      // You could also save to file or database here
      return logEntry;
    },

    sanitizeBody(body: unknown) {
      if (!body || typeof body !== 'object') return body;

      // Remove sensitive data
      const sanitized = { ...body } as Record<string, unknown>;
      if ('password' in sanitized) sanitized.password = '[REDACTED]';
      if ('api_key' in sanitized) sanitized.api_key = '[REDACTED]';
      if ('authToken' in sanitized) sanitized.authToken = '[REDACTED]';

      return sanitized;
    },

    sanitizeResponse(response: unknown) {
      if (!response || typeof response !== 'object') return response;

      // Remove sensitive data from response
      const sanitized = { ...response } as Record<string, unknown>;
      if ('authToken' in sanitized) {
        sanitized.authToken = '[REDACTED]';
      }

      return sanitized;
    },
  };
}
