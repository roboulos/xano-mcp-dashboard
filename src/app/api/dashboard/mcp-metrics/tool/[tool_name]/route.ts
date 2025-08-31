import { NextRequest, NextResponse } from 'next/server';

import { createRequestLogger } from '@/lib/api-logger';

const XANO_API_BASE = 'https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tool_name: string }> }
) {
  const logger = createRequestLogger(
    request,
    '/api/dashboard/mcp-metrics/tool/[tool_name]'
  );

  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get('days') || '7';
    const { tool_name: toolName } = await params;

    // Call Xano endpoint
    const response = await fetch(
      `${XANO_API_BASE}/mcp-metrics/tool/${encodeURIComponent(toolName)}?days=${encodeURIComponent(days)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = {
        error: data.message || 'Failed to fetch tool metrics',
      };
      await logger.logRequest({ tool_name: toolName, days }, errorResponse);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    if (data.error) {
      const errorResponse = { error: data.error };
      await logger.logRequest({ tool_name: toolName, days }, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    await logger.logRequest({ tool_name: toolName, days }, data);
    return NextResponse.json(data);
  } catch (error) {
    // Log error through the request logger
    const errorResponse = { error: 'Internal server error' };
    await logger.logRequest({}, errorResponse, error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
