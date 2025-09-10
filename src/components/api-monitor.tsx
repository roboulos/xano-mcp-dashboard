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
}

export function ApiMonitor() {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Intercept fetch to monitor API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      const id = Math.random().toString(36).substr(2, 9);
      const startTime = Date.now();
      
      // Add to calls list
      setCalls(prev => [...prev.slice(-19), {
        id,
        timestamp: startTime,
        method: options?.method || 'GET',
        url: url.toString(),
      }]);

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        
        // Update with response
        setCalls(prev => prev.map(call => 
          call.id === id 
            ? { ...call, status: response.status, duration, error: !response.ok }
            : call
        ));
        
        return response;
      } catch (error) {
        // Update with error
        setCalls(prev => prev.map(call => 
          call.id === id 
            ? { ...call, error: true, duration: Date.now() - startTime }
            : call
        ));
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
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
      >
        <span className="text-xs font-bold">API</span>
      </button>

      {/* Monitor Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[500px] overflow-hidden rounded-lg bg-white shadow-xl border">
          <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
            <h3 className="text-sm font-semibold">API Monitor</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          <div className="overflow-auto max-h-[440px] p-2">
            {calls.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-4">No API calls yet</p>
            ) : (
              <div className="space-y-1">
                {calls.slice().reverse().map(call => (
                  <div
                    key={call.id}
                    className={`rounded border p-2 text-xs ${
                      call.error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${
                        call.method === 'GET' ? 'text-blue-600' : 
                        call.method === 'POST' ? 'text-green-600' :
                        call.method === 'DELETE' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {call.method}
                      </span>
                      <span className="text-gray-500">
                        {call.duration ? `${call.duration}ms` : 'pending...'}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-gray-600">
                      {call.url.replace('https://xnwv-v1z6-dvnr.n7c.xano.io/api:', '')}
                    </div>
                    {call.status && (
                      <div className={`mt-1 ${call.error ? 'text-red-600' : 'text-green-600'}`}>
                        Status: {call.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}