import { NextRequest } from 'next/server';

export function createRequestLogger(request: NextRequest, endpoint: string) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  return {
    async logRequest(body: any, response: any, error?: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const logEntry = {
        requestId,
        timestamp: new Date().toISOString(),
        endpoint,
        method: request.method,
        url: request.url,
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
        body: this.sanitizeBody(body),
        response: this.sanitizeResponse(response),
        duration,
        error: error ? String(error) : undefined,
        status: response.error ? 'error' : 'success',
      };

      // In production, you might want to send this to a logging service
      // For now, just console.log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Log] ${endpoint}:`, logEntry);
      }

      // You could also save to file or database here
      return logEntry;
    },

    sanitizeBody(body: any) {
      if (!body) return body;
      
      // Remove sensitive data
      const sanitized = { ...body };
      if (sanitized.password) sanitized.password = '[REDACTED]';
      if (sanitized.api_key) sanitized.api_key = '[REDACTED]';
      if (sanitized.authToken) sanitized.authToken = '[REDACTED]';
      
      return sanitized;
    },

    sanitizeResponse(response: any) {
      if (!response) return response;
      
      // Remove sensitive data from response
      const sanitized = { ...response };
      if (sanitized.authToken) {
        sanitized.authToken = '[REDACTED]';
      }
      
      return sanitized;
    }
  };
}