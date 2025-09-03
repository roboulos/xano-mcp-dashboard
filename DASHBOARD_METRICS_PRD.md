# Dashboard Metrics Enhancement PRD

## Problem Statement

The MCP Control Center dashboard currently shows inaccurate metrics and fake activity data, creating a poor user experience and missing the opportunity to provide valuable insights about MCP tool usage.

### Current Issues Identified

**Team Management Tab (`enhanced-team-management.tsx:91-93`)**
- Shows "3 calls today" but API returns 26 total calls for the week
- Logic incorrectly divides weekly total by 7: `Math.floor((dashboardMetrics?.total_calls || 0) / 7)`
- Should show actual daily metrics, not approximated weekly averages
- Success rate shows 100% correctly from real data

**Activity Feed Tab (`contextual-activity-feed.tsx:67-171`)**
- Completely disconnected from real data
- Shows hardcoded mock events like "Sarah created 15 new user accounts"
- No actual MCP tool usage events displayed
- Has filters and UI but no real data source

**Available Real Data**
- 385 records in `xano_mcp_metrics` table
- 26 total calls (21 workspace tool, 5 instance tool) 
- 100% success rate, 0 errors
- Average response times: workspace 337ms, instance 328ms
- Data includes: user_id, tool_name, call_count, error_count, timestamps, durations

## Solution Overview

### 1. Fix Team Management Metrics Display

**Current State:**
```typescript
totalCalls: dashboardMetrics?.total_calls || 0,
callsToday: Math.floor((dashboardMetrics?.total_calls || 0) / 7), // WRONG
successRate: dashboardMetrics?.success_rate || 100,
```

**Required Changes:**
- Create endpoint for actual "today" metrics filtering by date
- Fix header display to show accurate daily vs weekly totals
- Add proper time period labels ("Today: X calls, This week: Y calls")

### 2. Real Activity Feed Implementation

**Current State:**
- Mock data with fake users and events
- No connection to MCP metrics table
- Filters work but have no real data

**Required Data Structure:**
```typescript
interface ActivityEvent {
  id: string;
  type: 'mcp_call' | 'error' | 'timeout' | 'success';
  tool_name: string; // 'workspace', 'instance', etc.
  user_id: string;
  timestamp: Date;
  duration_ms: number;
  status: 'success' | 'error';
  metadata: {
    call_count?: number;
    error_details?: string;
  };
}
```

### 3. New API Endpoints Needed

**A. Daily Metrics Endpoint**
- `GET /mcp-metrics/daily-summary`
- Returns today's specific metrics
- Separate from weekly aggregation

**B. Activity Events Endpoint** 
- `GET /mcp-metrics/activity-feed`
- Returns recent MCP tool usage events
- Supports filtering by time range, tool, status
- Paginated results for performance

**C. Enhanced Weekly Summary**
- Update existing `/mcp-metrics/real-summary` 
- Add daily breakdown within weekly data
- Include per-tool statistics

## Detailed Technical Requirements

### 1. Database Schema Analysis

**Current `xano_mcp_metrics` table structure:**
- `id` (primary key)
- `user_id` (UUID)
- `tool_name` ('workspace', 'instance')
- `date_hour` (timestamp for hourly aggregation)
- `call_count` (number of calls in that hour)
- `error_count` (number of errors)
- `success_count` (successful calls)
- `total_duration_ms` (total time spent)
- `avg_duration_ms` (average call duration)
- `created_at`, `last_updated` (timestamps)

### 2. API Endpoint Specifications

**Daily Summary Endpoint:**
```
GET /api:ZVMx4ul_/mcp-metrics/daily-summary?date=2025-09-02&timezone=UTC

Response:
{
  "date": "2025-09-02",
  "total_calls": 8,
  "total_errors": 0,
  "success_rate": 100,
  "tools": {
    "workspace": { "calls": 6, "avg_duration": 245 },
    "instance": { "calls": 2, "avg_duration": 387 }
  },
  "hourly_breakdown": [...]
}
```

**Activity Feed Endpoint:**
```
GET /api:ZVMx4ul_/mcp-metrics/activity-feed?limit=20&hours=24

Response:
{
  "events": [
    {
      "id": "evt_1",
      "timestamp": "2025-09-02T23:15:00Z", 
      "tool_name": "workspace",
      "user_id": "17b6fc02-966c-4642-babe-e8004afffc46",
      "call_count": 2,
      "duration_ms": 445,
      "status": "success"
    }
  ],
  "pagination": { "has_more": true, "next_cursor": "..." }
}
```

### 3. Frontend Component Updates

**Team Management Header Fix:**
```typescript
// Replace this approximation
callsToday: Math.floor((dashboardMetrics?.total_calls || 0) / 7),

// With actual daily data
callsToday: dailyMetrics?.total_calls || 0,

// And update header display
<p>{dailyMetrics?.total_calls || 0} calls today • {weeklyMetrics?.total_calls || 0} this week</p>
```

**Activity Feed Real Data Integration:**
- Replace mock data array with API call
- Update activity event rendering to show real MCP events
- Connect filters to actual API parameters
- Show meaningful descriptions like "Used workspace tool (2 calls, 445ms)"

### 4. Enhanced Metrics Display

**Additional Metrics to Show:**
- Most used tools (workspace vs instance)
- Peak usage hours
- Performance trends (response times)
- Error patterns (if any)
- User activity timeline

**Visual Improvements:**
- Real-time update indicators
- Tool usage distribution charts
- Response time histograms
- Success rate trends over time

## Implementation Priority

### Phase 1 (High Priority)
1. ✅ Fix pagination in existing endpoint (completed)
2. Create daily metrics endpoint
3. Fix Team Management "calls today" display
4. Test with real user scenarios

### Phase 2 (Medium Priority) 
1. Create activity feed endpoint
2. Replace mock activity data with real events
3. Add activity filtering and search
4. Implement proper event descriptions

### Phase 3 (Low Priority)
1. Add advanced metrics (hourly breakdown, trends)
2. Performance monitoring enhancements
3. Real-time updates with websockets
4. Export capabilities for metrics data

## Success Criteria

**Metrics Accuracy:**
- Team tab shows correct daily vs weekly call counts
- All numbers match actual database aggregations
- Success rates and error counts are accurate

**Activity Feed Functionality:**
- Shows real MCP tool usage events
- Filters work with actual data
- Events have meaningful, human-readable descriptions
- Performance is acceptable with large datasets

**User Experience:**
- Dashboard loads within 2 seconds
- Metrics update automatically
- Clear distinction between daily/weekly/historical data
- Intuitive tool usage insights

## Current Status

- ✅ Real data endpoint created and tested (26 calls, 100% success)
- ✅ Authentication working properly
- ❌ Frontend still showing incorrect daily calculations
- ❌ Activity feed completely fake
- ❌ Missing time period breakdown (daily vs weekly)

## Next Steps

1. Create daily metrics endpoint with proper date filtering
2. Fix Team Management component to use daily metrics
3. Analyze activity feed requirements and create endpoint
4. Update Activity component to consume real data
5. Add proper loading states and error handling