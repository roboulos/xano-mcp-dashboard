'use client';

import { useEffect, useState } from 'react';

import { X } from 'lucide-react';

interface ApiCall {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  status?: number;
  duration?: number;
  error?: boolean;
  // Enhanced debugging info
  apiGroup?: string;
  endpoint?: string;
  requestHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseData?: unknown;
  errorMessage?: string;
  stackTrace?: string[];
  component?: string;
  hasAuth?: boolean;
}

export function ApiMonitor() {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null);
  const [filter, setFilter] = useState<'all' | 'errors' | 'slow'>('all');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Intercept fetch to monitor API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      const urlString = url.toString();
      const id = Math.random().toString(36).substr(2, 9);
      const startTime = Date.now();

      // Parse API info from URL
      let apiGroup = 'unknown';
      let endpoint = urlString;
      const headers = options?.headers as Record<string, string> | undefined;
      const hasAuth = headers?.['Authorization'] ? true : false;

      // Extract Xano API details
      const xanoMatch = urlString.match(/\/api:([^/]+)(.*)/);
      if (xanoMatch) {
        const apiKeys: Record<string, string> = {
          Etd0xY9r: 'credentialsManagement',
          e6emygx3: 'authManagement',
          ZVMx4ul_: 'dashboardAnalytics',
          uBjgCRGU: 'billingManagement',
        };
        apiGroup = apiKeys[xanoMatch[1]] || xanoMatch[1];
        endpoint = xanoMatch[2] || '/';
      }

      // Try to determine component from stack trace
      const stack = new Error().stack?.split('\n') || [];
      const componentMatch = stack.find(
        line =>
          line.includes('use') ||
          line.includes('Component') ||
          line.includes('Page') ||
          line.includes('.tsx')
      );
      const component = componentMatch
        ? componentMatch.match(/at (\w+)/)?.[1] || 'Unknown'
        : 'Unknown';

      // Add to calls list with enhanced info
      setCalls(prev => [
        ...prev.slice(-49), // Keep last 50 calls
        {
          id,
          timestamp: startTime,
          method: options?.method || 'GET',
          url: urlString,
          apiGroup,
          endpoint,
          component,
          hasAuth,
          requestHeaders: options?.headers as Record<string, string>,
          requestBody: options?.body
            ? typeof options.body === 'string'
              ? JSON.parse(options.body)
              : options.body
            : undefined,
        },
      ]);

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        // Clone response to read body
        const responseClone = response.clone();
        let responseData;
        try {
          responseData = await responseClone.json();
        } catch {
          responseData = await responseClone.text();
        }

        // Update with response
        setCalls(prev =>
          prev.map(call =>
            call.id === id
              ? {
                  ...call,
                  status: response.status,
                  duration,
                  error: !response.ok,
                  responseData,
                }
              : call
          )
        );

        return response;
      } catch (error) {
        // Update with error details
        setCalls(prev =>
          prev.map(call =>
            call.id === id
              ? {
                  ...call,
                  error: true,
                  duration: Date.now() - startTime,
                  errorMessage:
                    error instanceof Error ? error.message : String(error),
                  stackTrace:
                    error instanceof Error ? error.stack?.split('\n') : [],
                }
              : call
          )
        );
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
      >
        <span className="text-xs font-bold">API</span>
      </button>

      {isOpen && (
        <div className="fixed right-4 bottom-20 z-50 max-h-[600px] w-[480px] overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">API Monitor</h3>
              <span className="text-xs text-gray-500">
                ({calls.length} calls)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={e =>
                  setFilter(e.target.value as 'all' | 'errors' | 'slow')
                }
                className="rounded border bg-white px-2 py-1 text-xs dark:bg-gray-700"
              >
                <option value="all">All</option>
                <option value="errors">Errors Only</option>
                <option value="slow">Slow (&gt;500ms)</option>
              </select>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="max-h-[540px] overflow-auto p-2">
            {calls.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">
                No API calls yet
              </p>
            ) : (
              <div className="space-y-1">
                {calls
                  .slice()
                  .reverse()
                  .filter(call => {
                    if (filter === 'errors') return call.error;
                    if (filter === 'slow') return (call.duration || 0) > 500;
                    return true;
                  })
                  .map(call => (
                    <div
                      key={call.id}
                      className={`cursor-pointer rounded border p-2 text-xs transition-colors ${
                        call.error
                          ? 'border-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20'
                          : call.duration && call.duration > 500
                            ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedCall(call)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              call.method === 'GET'
                                ? 'text-blue-600'
                                : call.method === 'POST'
                                  ? 'text-green-600'
                                  : call.method === 'DELETE'
                                    ? 'text-red-600'
                                    : 'text-yellow-600'
                            }`}
                          >
                            {call.method}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {call.apiGroup}
                          </span>
                          {call.hasAuth && (
                            <span
                              className="text-[10px] text-green-600"
                              title="Authenticated"
                            >
                              🔐
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {call.component !== 'Unknown' && (
                            <span className="text-[10px] text-purple-600">
                              {call.component}
                            </span>
                          )}
                          <span
                            className={`${
                              call.duration && call.duration > 1000
                                ? 'text-red-500'
                                : call.duration && call.duration > 500
                                  ? 'text-yellow-500'
                                  : 'text-gray-500'
                            }`}
                          >
                            {call.duration
                              ? `${call.duration}ms`
                              : 'pending...'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 truncate text-gray-600">
                        {call.endpoint}
                      </div>
                      {call.status && (
                        <div className="mt-1 flex items-center justify-between">
                          <span
                            className={`${
                              call.error
                                ? 'text-red-600'
                                : call.status >= 200 && call.status < 300
                                  ? 'text-green-600'
                                  : 'text-yellow-600'
                            }`}
                          >
                            Status: {call.status}
                          </span>
                          {call.errorMessage && (
                            <span className="max-w-[200px] truncate text-[10px] text-red-500">
                              {call.errorMessage}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedCall && (
        <div
          className="bg-opacity-50 fixed inset-0 z-[60] flex items-center justify-center bg-black p-4"
          onClick={() => setSelectedCall(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold">API Call Details</h3>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(80vh-80px)] overflow-auto p-4">
              <div className="mb-4 rounded bg-gray-50 p-3 dark:bg-gray-800">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">Method:</span>{' '}
                    <span
                      className={`font-mono ${
                        selectedCall.method === 'GET'
                          ? 'text-blue-600'
                          : selectedCall.method === 'POST'
                            ? 'text-green-600'
                            : selectedCall.method === 'DELETE'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                      }`}
                    >
                      {selectedCall.method}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span
                      className={`font-mono ${
                        selectedCall.error
                          ? 'text-red-600'
                          : selectedCall.status &&
                              selectedCall.status >= 200 &&
                              selectedCall.status < 300
                            ? 'text-green-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {selectedCall.status || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span>{' '}
                    <span
                      className={`font-mono ${
                        selectedCall.duration && selectedCall.duration > 1000
                          ? 'text-red-500'
                          : selectedCall.duration && selectedCall.duration > 500
                            ? 'text-yellow-500'
                            : 'text-gray-600'
                      }`}
                    >
                      {selectedCall.duration
                        ? `${selectedCall.duration}ms`
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">API Group:</span>{' '}
                    <span className="font-mono text-purple-600">
                      {selectedCall.apiGroup}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Component:</span>{' '}
                    <span className="font-mono text-blue-600">
                      {selectedCall.component}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Auth:</span>{' '}
                    <span
                      className={`font-mono ${selectedCall.hasAuth ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {selectedCall.hasAuth ? '✓ Authenticated' : '✗ No Auth'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="mb-2 font-semibold">Endpoint</h4>
                <div className="rounded bg-gray-100 p-3 font-mono text-sm break-all dark:bg-gray-800">
                  {selectedCall.url}
                </div>
              </div>
              {selectedCall.requestHeaders && (
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold">Request Headers</h4>
                  <div className="rounded bg-gray-100 p-3 dark:bg-gray-800">
                    <pre className="overflow-x-auto text-xs">
                      {JSON.stringify(
                        Object.fromEntries(
                          Object.entries(selectedCall.requestHeaders).map(
                            ([k, v]) => [k, k === 'Authorization' ? '***' : v]
                          )
                        ),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
              {selectedCall.requestBody !== undefined && (
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold">Request Body</h4>
                  <div className="rounded bg-gray-100 p-3 dark:bg-gray-800">
                    <pre className="overflow-x-auto text-xs">
                      {JSON.stringify(
                        selectedCall.requestBody as object,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
              {selectedCall.responseData !== undefined && (
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold">Response Data</h4>
                  <div className="rounded bg-gray-100 p-3 dark:bg-gray-800">
                    <pre className="overflow-x-auto text-xs">
                      {typeof selectedCall.responseData === 'object'
                        ? JSON.stringify(
                            selectedCall.responseData as object,
                            null,
                            2
                          )
                        : String(selectedCall.responseData)}
                    </pre>
                  </div>
                </div>
              )}
              {selectedCall.error && (
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-red-600">
                    Error Details
                  </h4>
                  {selectedCall.errorMessage && (
                    <div className="mb-2 rounded bg-red-50 p-3 dark:bg-red-900/20">
                      <p className="text-sm text-red-600">
                        {selectedCall.errorMessage}
                      </p>
                    </div>
                  )}
                  {selectedCall.stackTrace &&
                    selectedCall.stackTrace.length > 0 && (
                      <div className="rounded bg-gray-100 p-3 dark:bg-gray-800">
                        <pre className="overflow-x-auto text-xs text-red-600">
                          {selectedCall.stackTrace.slice(0, 10).join('\n')}
                        </pre>
                      </div>
                    )}
                </div>
              )}
              <div className="mt-4 text-xs text-gray-500">
                Called at: {new Date(selectedCall.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
