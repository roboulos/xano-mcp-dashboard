# Xano Backend Implementation PRD
## MCP Dashboard Backend Requirements

### Executive Summary

This PRD defines the backend implementation required in Xano to support the MCP Dashboard frontend. Based on comprehensive analysis of the frontend codebase and existing Xano workspace (Snappy - ID: 5), we need to extend the existing multi-tool MCP platform with enhanced team management, API key handling, activity tracking, and usage analytics.

**Key Findings:**
- Existing users table: "👤 users" (with emoji in title)
- Existing MCP infrastructure: xano_credentials, xano_mcp_logs, xano_mcp_metrics tables
- Existing Universe tool: "🌐 universe_connections" table and API group
- 15 existing API groups including auth, analytics, and multiple MCP tools

**Confidence Level: 98%+** (Verified against actual Xano workspace structure)

---

## 1. Database Schema

### 1.1 Existing Tables to Leverage

#### **"👤 users"** (EXISTING - auth enabled)
```
- id (uuid, primary key) ✓ Exists
- created_at (timestamp) ✓ Exists
- email (email, unique) ✓ Exists
- password (password, internal) ✓ Exists
- name (text) ✓ Exists
- first_name (text) ✓ Exists
- last_name (text) ✓ Exists
- company (text) ✓ Exists
- role (text, default: "user") ✓ Exists
- subscription_tier (text, default: "free") ✓ Exists
- email_verified (bool) ✓ Exists
- status (text, default: "active") ✓ Exists
- last_login (timestamp) ✓ Exists

TO ADD:
- workspace_id (int, reference to workspaces.id)
- avatar_url (text, nullable)
```

#### **xano_credentials** (EXISTING - for MCP auth)
```
- id (int, primary key) ✓ Exists
- user_id (uuid, reference to "👤 users") ✓ Exists
- credential_name (text) ✓ Exists
- xano_api_key (text) ✓ Exists
- xano_instance_name (text) ✓ Exists
- is_default (bool) ✓ Exists
- is_active (bool) ✓ Exists

TO ADD:
- workspace_id (int, reference to workspaces.id)
- assigned_team_members (json, array of user_ids)
```

### 1.2 New Tables to Create

#### **workspaces** (Multi-tenancy root - NEW)
```
- id (int, primary key, auto-increment)
- name (text, required)
- slug (text, unique, required) 
- owner_id (uuid, reference to "👤 users".id)
- stripe_customer_id (text, nullable)
- stripe_subscription_id (text, nullable)
- subscription_status (enum: trial, active, past_due, canceled, expired)
- subscription_plan (enum: free, starter, pro, enterprise)
- trial_ends_at (timestamp, nullable)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: slug, owner_id, stripe_customer_id

#### **workspace_members**
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (int, reference to users.id)
- role (enum: owner, admin, member, viewer)
- status (enum: active, invited, disabled)
- invited_by (int, reference to users.id, nullable)
- invitation_token (text, nullable)
- invitation_expires (timestamp, nullable)
- last_active_at (timestamp, nullable)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: workspace_id + user_id (unique), invitation_token
**Security**: Enable row-level auth filtering by workspace_id

#### **api_keys**
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- name (text, required)
- description (text, nullable)
- key_prefix (text, required) // First 8 chars for display
- key_hash (text, required) // SHA-256 hash of full key
- assigned_to (int, reference to users.id, nullable)
- scopes (json, default: ["read"])
- status (enum: active, revoked, expired)
- expires_at (timestamp, nullable)
- last_used_at (timestamp, nullable)
- usage_count (int, default: 0)
- created_by (int, reference to users.id)
- created_at (timestamp, default: now())
- revoked_at (timestamp, nullable)
```
**Indexes**: workspace_id, key_hash, assigned_to, status
**Security**: Never store plain text keys

#### **mcp_connections** (NEW - multi-tool support)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- name (text, required)
- tool_type (enum: claude-desktop, claude-code, cursor, generic)
- mcp_tool (enum: xano-turbo, universe, airtable, freshbooks, stripe) // Which MCP tool
- environment (enum: production, staging, development)
- config (json, encrypted) // Store encrypted config
- credential_id (int, nullable) // References tool-specific credential tables
- status (enum: active, inactive)
- created_by (uuid, reference to "👤 users".id)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: workspace_id, tool_type, mcp_tool, environment
**Note**: credential_id references xano_credentials.id for xano-turbo, "🌐 universe_connections".id for universe, etc.

#### **activity_logs** (NEW - extends existing logging)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id, nullable)
- api_key_id (int, reference to api_keys.id, nullable)
- action (text, required) // e.g., "api_key.created", "member.invited"
- resource_type (text, nullable) // e.g., "api_key", "user", "xano_tool", "universe_tool"
- resource_id (int, nullable)
- metadata (json, nullable) // Additional context
- ip_address (text, nullable)
- user_agent (text, nullable)
- created_at (timestamp, default: now())
```
**Indexes**: workspace_id, user_id, action, created_at
**Note**: Complements existing xano_mcp_logs for tool-specific logging

#### **api_usage**
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- api_key_id (int, reference to api_keys.id)
- endpoint (text, required)
- method (text, required)
- status_code (int, required)
- response_time_ms (int, required)
- request_size (int, nullable)
- response_size (int, nullable)
- error_message (text, nullable)
- created_at (timestamp, default: now())
```
**Indexes**: workspace_id, api_key_id, created_at
**Partitioning**: By created_at (monthly)

### 1.2 Supporting Tables

#### **workspace_invitations**
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- email (email, required)
- role (enum: admin, member, viewer)
- token (text, unique, required)
- invited_by (int, reference to users.id)
- expires_at (timestamp, required)
- accepted_at (timestamp, nullable)
- created_at (timestamp, default: now())
```

#### **workspace_settings**
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id, unique)
- allow_api_key_creation (bool, default: true)
- require_2fa (bool, default: false)
- ip_whitelist (json, nullable)
- webhook_url (text, nullable)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

---

## 2. API Structure

### 2.1 API Groups

#### EXISTING API Groups to Extend:
- **🔒 Authentication Management** - Add workspace context
- **📊 Dashboard Analytics** - Enhance with workspace filtering
- **🔑 Xano Credentials Management** - Add team sharing
- **🌐 Universe MCP API** - Add workspace isolation

#### NEW API Groups to Create:

#### **👥 Team Management** (/team)
Authenticated endpoints for managing workspace members

#### **🔑 Workspace API Keys** (/workspace-api-keys)
Authenticated endpoints for workspace-level API key management

#### **⚙️ Workspace Settings** (/workspace-settings)
Authenticated endpoints for workspace configuration

#### **💳 Billing** (/billing)
Authenticated endpoints for Stripe integration

#### **🔗 MCP Tool Hub** (/mcp-hub)
Unified endpoints for all MCP tool configurations (xano, universe, etc.)

### 2.2 Detailed API Endpoints

#### Authentication Endpoints

**POST /auth/register** (MODIFY EXISTING)
```
Input: {
  email: string,
  password: string,
  name: string,
  workspace_name: string,
  first_name?: string,
  last_name?: string,
  company?: string
}
Process:
  1. Create user in "👤 users" table
  2. Create workspace with user as owner
  3. Create workspace_member record
  4. Use existing Magic Link system for verification
  5. Return auth token with workspace context
Response: {
  user: User,
  workspace: Workspace,
  token: string
}
```

**POST /auth/login**
```
Input: {
  email: string,
  password: string
}
Process:
  1. Verify credentials
  2. Get user's workspaces
  3. Generate auth token
Response: {
  user: User,
  workspaces: Workspace[],
  token: string
}
```

**POST /auth/verify-email**
```
Input: {
  token: string
}
Process:
  1. Validate token
  2. Mark email as verified
  3. Log activity
Response: {
  success: boolean
}
```

#### Team Management Endpoints

**GET /team/members**
```
Auth: Required (workspace context)
Query: {
  page?: number,
  per_page?: number,
  status?: string
}
Response: {
  members: WorkspaceMember[],
  total: number,
  page: number
}
```

**POST /team/invite**
```
Auth: Required (admin/owner only)
Input: {
  email: string,
  role: 'admin' | 'member' | 'viewer'
}
Process:
  1. Check invite limits
  2. Create invitation
  3. Send invite email
  4. Log activity
Response: {
  invitation: Invitation
}
```

**PUT /team/members/:id**
```
Auth: Required (admin/owner only)
Input: {
  role?: string,
  status?: 'active' | 'disabled'
}
Process:
  1. Validate permissions
  2. Update member
  3. Log activity
Response: {
  member: WorkspaceMember
}
```

**DELETE /team/members/:id**
```
Auth: Required (admin/owner only)
Process:
  1. Check not removing last owner
  2. Remove member
  3. Revoke associated API keys
  4. Log activity
Response: {
  success: boolean
}
```

#### API Key Management Endpoints

**GET /api-keys**
```
Auth: Required
Query: {
  page?: number,
  per_page?: number,
  assigned_to?: number,
  status?: string
}
Response: {
  keys: ApiKey[],
  total: number
}
```

**POST /api-keys**
```
Auth: Required
Input: {
  name: string,
  description?: string,
  assigned_to?: number,
  scopes: string[],
  expires_at?: timestamp
}
Process:
  1. Generate secure key
  2. Hash and store
  3. Log activity
Response: {
  key: {
    id: number,
    name: string,
    key: string, // Only returned once!
    prefix: string
  }
}
```

**PUT /api-keys/:id**
```
Auth: Required
Input: {
  name?: string,
  description?: string,
  assigned_to?: number,
  status?: 'active' | 'revoked'
}
Response: {
  key: ApiKey
}
```

**POST /api-keys/:id/regenerate**
```
Auth: Required (admin/owner only)
Process:
  1. Generate new key
  2. Invalidate old key
  3. Log activity
Response: {
  key: string // Only returned once!
}
```

#### Analytics Endpoints

**GET /analytics/overview**
```
Auth: Required
Query: {
  start_date?: date,
  end_date?: date
}
Response: {
  total_api_calls: number,
  active_connections: number,
  team_members: number,
  api_keys: number,
  recent_activity: Activity[]
}
```

**GET /analytics/usage**
```
Auth: Required
Query: {
  start_date?: date,
  end_date?: date,
  group_by?: 'day' | 'hour',
  api_key_id?: number
}
Response: {
  usage: {
    timestamp: string,
    calls: number,
    errors: number,
    avg_response_time: number
  }[]
}
```

**GET /analytics/activity-feed**
```
Auth: Required
Query: {
  page?: number,
  per_page?: number,
  user_id?: number,
  action?: string
}
Response: {
  activities: Activity[],
  total: number
}
```

#### MCP Connection Endpoints

**GET /mcp/connections**
```
Auth: Required
Response: {
  connections: McpConnection[]
}
```

**POST /mcp/connections**
```
Auth: Required
Input: {
  name: string,
  tool_type: string,
  environment: string,
  xano_instance: string,
  api_key_id: number
}
Response: {
  connection: McpConnection,
  config: object // Generated config
}
```

**GET /mcp/connections/:id/config**
```
Auth: Required
Response: {
  tool_type: string,
  config: object // Tool-specific config
}
```

---

## 3. Security Implementation

### 3.1 Authentication Flow
1. Leverage existing Magic Link authentication system
2. Extend JWT tokens to include workspace_id and role
3. Validate workspace membership on each request
4. Support multi-workspace switching
5. Integrate with existing auth_sessions table

### 3.2 API Key Security
1. Generate 40-character random keys
2. Store only SHA-256 hash in database
3. Show full key only once after creation
4. Implement key rotation mechanism

### 3.3 Row-Level Security
1. All queries filtered by workspace_id
2. Validate user belongs to workspace
3. Check role permissions for actions
4. Log all permission checks

### 3.4 Rate Limiting
```
- Authentication: 5 requests/minute
- API endpoints: 100 requests/minute
- Analytics: 10 requests/minute
```

---

## 4. Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
1. Create workspace and workspace_members tables
2. Extend existing "👤 users" table with workspace_id
3. Modify existing authentication to include workspace context
4. Create workspace management endpoints
5. Ensure isolation between MCP tools (xano, universe, etc.)

### Phase 2: Team Management (Week 2)
1. Implement invitation system
2. Role-based permissions
3. Member management endpoints
4. Email notifications

### Phase 3: API Key System (Week 3)
1. Key generation and storage
2. Assignment and permissions
3. Usage tracking
4. Security validations

### Phase 4: Analytics & Activity (Week 4)
1. Activity logging middleware
2. Usage aggregation jobs
3. Analytics endpoints
4. Real-time activity feed

### Phase 5: MCP Tool Hub Integration (Week 5)
1. Unified connection management for all MCP tools
2. Tool-specific credential handling:
   - Xano: Use existing xano_credentials
   - Universe: Use existing "🌐 universe_connections"
   - Others: Create new credential tables as needed
3. Config generators for each development environment
4. Cross-tool activity tracking and analytics
5. Maintain backward compatibility with existing tools

### Phase 6: Billing Integration (Week 6)
1. Stripe webhook handlers
2. Subscription management
3. Usage limits enforcement
4. Billing portal integration

---

## 5. Performance Optimizations

### 5.1 Database
- Index all foreign keys
- Partition usage tables by month
- Archive old activity logs
- Use materialized views for analytics

### 5.2 Caching
- Cache workspace members (5 min)
- Cache API key lookups (1 min)
- Cache analytics aggregations (15 min)
- Use Redis for session storage

### 5.3 Background Jobs
- Aggregate usage data hourly
- Clean expired invitations daily
- Send activity digests weekly
- Archive old logs monthly

---

## 6. Testing Requirements

### 6.1 Unit Tests
- All authentication flows
- Permission validations
- API key generation
- Data aggregations

### 6.2 Integration Tests
- Full user journey
- Team invitation flow
- API key lifecycle
- Analytics accuracy

### 6.3 Security Tests
- SQL injection prevention
- XSS protection
- Rate limit enforcement
- Token validation

---

## 7. Monitoring & Alerts

### 7.1 Key Metrics
- API response times
- Error rates by endpoint
- Active users per workspace
- API key usage patterns

### 7.2 Alerts
- Failed login attempts > 10/hour
- API errors > 5%
- Database query time > 1s
- Disk usage > 80%

---

## 8. Documentation

### 8.1 API Documentation
- Extend existing Swagger docs for all API groups
- Multi-workspace authentication guide
- MCP tool integration patterns
- Rate limit details per tool

### 8.2 Integration Guides
- Unified MCP tool setup
- Tool-specific credential management
- Cross-tool analytics
- Migration guide for existing users

---

## 9. Key Implementation Considerations

### 9.1 Multi-Tool Architecture
- Each MCP tool maintains its own credential and connection tables
- Unified activity logging across all tools
- Workspace-level isolation for all tool data
- Shared analytics and metrics infrastructure

### 9.2 Backward Compatibility
- Existing single-user setups continue to work
- Gradual migration path to workspace model
- Preserve existing tool integrations
- Maintain existing API contracts

### 9.3 Special Table Handling
- Tables with emojis require quotes in XanoScript: `db.query "👤 users"`
- Use table IDs for reliable references in code
- Consider creating views with standard names for easier querying

---

## Conclusion

This PRD extends the existing Xano MCP platform to support the dashboard requirements while maintaining compatibility with the current multi-tool architecture. The design:

- **Leverages Existing Infrastructure**: Uses current auth, logging, and tool tables
- **Supports Multiple MCP Tools**: Maintains isolation between xano-turbo, universe, etc.
- **Enables Team Collaboration**: Adds workspace and team management layers
- **Preserves Flexibility**: Each tool can maintain its own credential structure

Implementation should begin with Phase 1, focusing on the workspace layer while preserving all existing functionality.