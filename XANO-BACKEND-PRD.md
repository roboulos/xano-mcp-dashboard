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

### 1.2 Tool-Specific Credential Tables

#### **EXISTING Tool Credentials**
- **xano_credentials** - For Xano MCP tool
- **"🌐 universe_connections"** - For Universe MCP tool

#### **NEW Tool Credentials (as needed)**

**airtable_credentials** - For Airtable MCP tool
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- name (text, required)
- api_key_hash (text, required) // Encrypted API key
- base_ids (json, array) // Multiple Airtable base IDs
- assigned_to_members (json, array of user_ids)
- status (enum: active, revoked)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

**freshbooks_credentials** - For Freshbooks MCP tool
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- name (text, required)
- client_id (text, required)
- access_token (text, encrypted)
- refresh_token (text, encrypted)
- token_expires_at (timestamp)
- account_id (text) // Freshbooks account ID
- assigned_to_members (json, array of user_ids)
- status (enum: active, revoked, expired)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

**stripe_credentials** - For Stripe MCP tool
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- name (text, required)
- secret_key_hash (text, required) // Encrypted secret key
- publishable_key (text, required) // Can be stored in plain text
- webhook_secret_hash (text) // For webhook verification
- mode (enum: test, live)
- assigned_to_members (json, array of user_ids)
- status (enum: active, revoked)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

Each tool maintains its own credential structure based on its specific requirements. The common pattern includes workspace isolation, team sharing via assigned_to_members, and proper encryption for sensitive data.

### 1.3 New Tables to Create

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
- billing_email (email, nullable) // Can be different from owner email
- tax_id (text, nullable) // VAT number, etc.
- billing_address (json, nullable) // Address for invoices
- usage_alerts_enabled (bool, default: true)
- overage_protection (bool, default: true) // Block requests when limit exceeded
- next_billing_date (timestamp, nullable)
- subscription_cancel_at_period_end (bool, default: false)
- subscription_canceled_at (timestamp, nullable)
- last_payment_failed_at (timestamp, nullable)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: slug, owner_id, stripe_customer_id

#### **workspace_members**
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- role (enum: owner, admin, member, viewer)
- status (enum: active, invited, disabled)
- mcp_tools_access (json, array) // ["xano-turbo", "universe"] - which tools they can use
- invited_by (uuid, reference to "👤 users".id, nullable)
- invitation_token (text, nullable)
- invitation_expires (timestamp, nullable)
- last_active_at (timestamp, nullable)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: workspace_id + user_id (unique), invitation_token
**Security**: Enable row-level auth filtering by workspace_id

#### **xano_api_keys** (NEW - Xano tool credentials)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- name (text, required)
- description (text, nullable)
- key_prefix (text, required) // First 8 chars for display
- key_hash (text, required) // SHA-256 hash of full key
- xano_instance (text, required) // Which Xano instance this key is for
- environment (enum: production, staging, development)
- assigned_to_members (json, array of user_ids) // Team members who can use this
- status (enum: active, revoked, expired)
- last_used_at (timestamp, nullable)
- usage_count (int, default: 0)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: workspace_id, user_id, status
**Security**: Never store plain text keys
**Note**: This stores actual Xano API keys that users save for the Xano MCP tool

#### **mcp_connections** (NEW - multi-tool support)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- name (text, required)
- tool_type (enum: claude-desktop, claude-code, cursor, generic)
- mcp_tool (enum: xano-turbo, universe, airtable, freshbooks, stripe) // Which MCP tool
- environment (enum: production, staging, development)
- config (json, encrypted) // Store encrypted config
- credential_reference (json) // {"table": "xano_credentials", "id": 123}
- status (enum: active, inactive)
- created_by (uuid, reference to "👤 users".id)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: workspace_id, tool_type, mcp_tool, environment
**Note**: credential_reference stores which table and ID to look up for tool-specific credentials

#### **activity_logs** (NEW - extends existing logging)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id, nullable)
- tool_credential_id (int, nullable) // References the specific tool credential used
- action (text, required) // e.g., "api_key.created", "member.invited"
- resource_type (text, nullable) // e.g., "api_key", "user", "xano_tool", "universe_tool"
- resource_id (int, nullable)
- mcp_tool (text, nullable) // Which tool was involved
- metadata (json, nullable) // Additional context
- ip_address (text, nullable)
- user_agent (text, nullable)
- created_at (timestamp, default: now())
```
**Indexes**: workspace_id, user_id, action, mcp_tool, created_at
**Note**: Complements existing tool-specific logs (xano_mcp_logs, etc.)

#### **api_usage**
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- api_key_id (int, reference to xano_api_keys.id) // For Xano-specific usage
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
- usage_alert_thresholds (json, default: '{"80": true, "90": true, "100": true}')
- overage_billing_enabled (bool, default: false)
- webhook_notifications_enabled (bool, default: true)
- invoice_email_enabled (bool, default: true)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

### 1.3 Subscription & Billing Tables

#### **subscription_plans** (NEW - Master plan definitions)
```
- id (int, primary key, auto-increment)
- name (text, required) // "Free", "Starter", "Pro", "Enterprise"
- slug (text, unique, required) // "free", "starter", "pro", "enterprise"
- stripe_price_id (text, nullable) // Stripe Price ID for paid plans
- stripe_product_id (text, nullable) // Stripe Product ID
- billing_interval (enum: month, year, nullable) // null for free plan
- price_cents (int, default: 0) // Price in cents
- currency (text, default: "usd")
- trial_days (int, default: 14)
- is_active (bool, default: true)
- sort_order (int, default: 0)
- features (json, required) // Feature limits and capabilities
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Features JSON structure:**
```json
{
  "max_team_members": 5,
  "max_api_keys": 10,
  "max_mcp_configurations": 3,
  "api_calls_per_month": 10000,
  "max_workspaces": 1,
  "analytics_retention_days": 30,
  "priority_support": false,
  "custom_branding": false,
  "sso_enabled": false,
  "audit_logs": false,
  "usage_alerts": true,
  "webhook_endpoints": 2
}
```

#### **subscription_history** (NEW - Track subscription changes)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- subscription_id (text, required) // Stripe subscription ID
- event_type (enum: created, updated, canceled, reactivated, trial_ended, payment_failed)
- from_plan_slug (text, nullable) // Previous plan
- to_plan_slug (text, nullable) // New plan
- change_reason (text, nullable) // upgrade, downgrade, cancellation_reason
- effective_date (timestamp, required)
- stripe_event_id (text, nullable) // Stripe webhook event ID
- metadata (json, nullable) // Additional context
- created_at (timestamp, default: now())
```

#### **usage_tracking** (NEW - Enhanced usage tracking)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- usage_type (enum: api_calls, team_members, api_keys, mcp_configurations)
- date (date, required) // Daily aggregation
- count (int, default: 0)
- limit_exceeded (bool, default: false)
- overage_amount (int, default: 0) // Amount over limit
- billing_period_start (date, required)
- billing_period_end (date, required)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```
**Indexes**: workspace_id + date + usage_type (unique), billing_period_start

#### **billing_events** (NEW - Stripe webhook event log)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id, nullable)
- stripe_event_id (text, unique, required)
- event_type (text, required) // e.g., "customer.subscription.updated"
- processed (bool, default: false)
- processing_attempts (int, default: 0)
- error_message (text, nullable)
- stripe_data (json, required) // Raw Stripe event data
- created_at (timestamp, default: now())
- processed_at (timestamp, nullable)
```

#### **invoices** (NEW - Invoice tracking)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- stripe_invoice_id (text, unique, required)
- stripe_customer_id (text, required)
- invoice_number (text, required)
- status (enum: draft, open, paid, past_due, canceled, uncollectible)
- amount_paid (int, required) // in cents
- amount_due (int, required) // in cents
- currency (text, default: "usd")
- billing_period_start (timestamp, required)
- billing_period_end (timestamp, required)
- invoice_pdf_url (text, nullable)
- hosted_invoice_url (text, nullable)
- due_date (timestamp, nullable)
- paid_at (timestamp, nullable)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

#### **usage_limits** (NEW - Dynamic limit enforcement)
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id, unique)
- api_calls_limit (int, required)
- api_calls_used (int, default: 0)
- team_members_limit (int, required)
- team_members_used (int, default: 0)
- api_keys_limit (int, required)
- api_keys_used (int, default: 0)
- mcp_configurations_limit (int, required)
- mcp_configurations_used (int, default: 0)
- billing_period_start (timestamp, required)
- billing_period_end (timestamp, required)
- overage_notifications_sent (int, default: 0)
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

#### **🔑 Tool Credentials Management** (/tool-credentials)
Authenticated endpoints for managing saved credentials for each MCP tool
- Xano: API keys  
- Universe: Connection strings
- Airtable: API keys + base IDs
- etc.

#### **⚙️ Workspace Settings** (/workspace-settings)
Authenticated endpoints for workspace configuration

#### **💳 Billing** (/billing)
Authenticated endpoints for Stripe integration

#### **🔗 MCP Tool Hub** (/mcp-hub)
Unified endpoints for all MCP tool configurations (xano, universe, etc.)

#### **💰 Subscription Management** (/billing/subscription)
Authenticated endpoints for subscription and plan management

#### **📊 Usage Tracking** (/billing/usage)
Authenticated endpoints for usage monitoring and limits

#### **🧾 Invoice Management** (/billing/invoices)
Authenticated endpoints for invoice history and downloads

#### **🪝 Stripe Webhooks** (/webhooks/stripe)
Webhook handlers for Stripe events

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

**GET /tool-credentials/xano**
```
Auth: Required
Query: {
  page?: number,
  per_page?: number,
  assigned_to?: string, // UUID
  status?: string,
  environment?: string
}
Response: {
  credentials: XanoApiKey[],
  total: number
}
```

**GET /tool-credentials/universe**
```
Auth: Required
Query: {
  page?: number,
  per_page?: number
}
Response: {
  connections: UniverseConnection[],
  total: number
}
```

**GET /tool-credentials/airtable**
```
Auth: Required
Query: {
  page?: number,
  per_page?: number
}
Response: {
  credentials: AirtableCredential[],
  total: number
}
```

**POST /tool-credentials/xano**
```
Auth: Required
Input: {
  name: string,
  description?: string,
  xano_api_key: string, // The actual Xano API key
  xano_instance: string,
  environment: string,
  assigned_to_members?: string[] // UUIDs
}
Process:
  1. Validate API key with Xano
  2. Hash and store key
  3. Log activity
Response: {
  credential: {
    id: number,
    name: string,
    key_prefix: string, // First 8 chars
    instance: string,
    assigned_to_members: string[]
  }
}
```

**POST /tool-credentials/universe**
```
Auth: Required
Input: {
  connection_name: string,
  universe_host: string,
  universe_port: number,
  universe_username: string,
  universe_password: string,
  protocol: string,
  assigned_to_members?: string[] // UUIDs
}
Response: {
  connection: UniverseConnection
}
```

**POST /tool-credentials/airtable**
```
Auth: Required
Input: {
  name: string,
  api_key: string,
  base_ids: string[], // Multiple base IDs
  assigned_to_members?: string[] // UUIDs
}
Response: {
  credential: AirtableCredential
}
```

**PUT /tool-credentials/xano/:id**
```
Auth: Required
Input: {
  name?: string,
  description?: string,
  assigned_to_members?: string[], // UUIDs
  status?: 'active' | 'revoked'
}
Response: {
  credential: XanoApiKey
}
```

**PUT /tool-credentials/universe/:id**
```
Auth: Required
Input: {
  connection_name?: string,
  assigned_to_members?: string[] // UUIDs
}
Response: {
  connection: UniverseConnection
}
```

**DELETE /tool-credentials/xano/:id**
```
Auth: Required (admin/owner only)
Process:
  1. Mark credential as revoked
  2. Remove from all assigned members
  3. Log activity
Response: {
  success: boolean
}
```

**DELETE /tool-credentials/universe/:id**
```
Auth: Required (admin/owner only)
Process:
  1. Remove connection
  2. Log activity
Response: {
  success: boolean
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
  workspace_api_key_id?: number,
  mcp_tool?: string // Filter by specific tool
}
Response: {
  usage: {
    timestamp: string,
    calls: number,
    errors: number,
    avg_response_time: number,
    by_tool: { [tool: string]: number } // Breakdown by MCP tool
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
  mcp_tool: string, // "xano-turbo", "universe", etc.
  environment: string,
  credential_reference: {
    table: string, // "xano_credentials" or "🌐 universe_connections"
    id: number
  }
}
Process:
  1. Validate user has access to the MCP tool
  2. Verify credential exists and belongs to workspace
  3. Create connection config
Response: {
  connection: McpConnection,
  config: object // Generated config for the specific tool
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

#### Subscription Management Endpoints

**GET /billing/subscription**
```
Auth: Required
Response: {
  subscription: {
    id: string,
    status: "trial" | "active" | "past_due" | "canceled" | "expired",
    current_plan: {
      name: string,
      slug: string,
      price_cents: number,
      billing_interval: string,
      features: object
    },
    trial_ends_at: timestamp | null,
    next_billing_date: timestamp | null,
    cancel_at_period_end: boolean,
    usage: {
      api_calls: { used: number, limit: number, percentage: number },
      team_members: { used: number, limit: number, percentage: number },
      api_keys: { used: number, limit: number, percentage: number },
      mcp_configurations: { used: number, limit: number, percentage: number }
    }
  }
}
```

**POST /billing/subscription/upgrade**
```
Auth: Required (admin/owner only)
Input: {
  plan_slug: string, // "starter", "pro", "enterprise"
  billing_interval: "month" | "year"
}
Process:
  1. Validate plan exists and is upgrade
  2. Calculate prorated amount
  3. Create Stripe subscription or modify existing
  4. Update workspace subscription details
  5. Log subscription history
Response: {
  subscription: Subscription,
  proration_amount: number,
  effective_date: timestamp
}
```

**POST /billing/subscription/downgrade**
```
Auth: Required (admin/owner only)
Input: {
  plan_slug: string,
  effective_date: "immediate" | "period_end"
}
Process:
  1. Validate new plan limits vs current usage
  2. Schedule downgrade in Stripe
  3. Update subscription details
  4. Send confirmation email
Response: {
  subscription: Subscription,
  effective_date: timestamp,
  usage_warnings: string[] // If current usage exceeds new limits
}
```

**POST /billing/subscription/cancel**
```
Auth: Required (admin/owner only)
Input: {
  cancel_at_period_end: boolean,
  cancellation_reason?: string,
  feedback?: string
}
Process:
  1. Cancel Stripe subscription
  2. Update workspace status
  3. Log cancellation reason
  4. Send confirmation email
  5. Schedule data retention reminders
Response: {
  subscription: Subscription,
  data_retention_until: timestamp,
  export_deadline: timestamp
}
```

**POST /billing/subscription/reactivate**
```
Auth: Required (admin/owner only)
Process:
  1. Check if reactivation is possible
  2. Reactivate Stripe subscription
  3. Update workspace status
  4. Reset usage counters for new billing period
Response: {
  subscription: Subscription,
  reactivated_at: timestamp
}
```

#### Plan Management Endpoints

**GET /billing/plans**
```
Auth: Optional (public endpoint)
Query: {
  billing_interval?: "month" | "year"
}
Response: {
  plans: [
    {
      id: number,
      name: string,
      slug: string,
      price_cents: number,
      billing_interval: string | null,
      trial_days: number,
      features: object,
      is_popular: boolean,
      savings_percentage?: number // for annual plans
    }
  ]
}
```

**GET /billing/plans/:slug**
```
Auth: Optional
Response: {
  plan: {
    id: number,
    name: string,
    slug: string,
    price_cents: number,
    billing_interval: string | null,
    trial_days: number,
    features: object,
    feature_comparison: object // Detailed feature breakdown
  }
}
```

#### Usage Tracking Endpoints

**GET /billing/usage**
```
Auth: Required
Query: {
  start_date?: date,
  end_date?: date,
  usage_type?: "api_calls" | "team_members" | "api_keys" | "mcp_configurations"
}
Response: {
  current_period: {
    start_date: date,
    end_date: date,
    usage: {
      api_calls: { used: number, limit: number, overage: number },
      team_members: { used: number, limit: number },
      api_keys: { used: number, limit: number },
      mcp_configurations: { used: number, limit: number }
    }
  },
  daily_breakdown: [
    {
      date: date,
      api_calls: number,
      // ... other metrics
    }
  ],
  alerts: [
    {
      type: "approaching_limit" | "limit_exceeded",
      usage_type: string,
      percentage: number,
      message: string
    }
  ]
}
```

**POST /billing/usage/increment**
```
Auth: Internal API only (called by application)
Input: {
  usage_type: "api_calls" | "team_members" | "api_keys" | "mcp_configurations",
  amount: number,
  metadata?: object
}
Process:
  1. Check current limits
  2. Increment usage counter
  3. Check if limits exceeded
  4. Send alerts if thresholds reached
  5. Block request if overage protection enabled
Response: {
  allowed: boolean,
  current_usage: number,
  limit: number,
  percentage_used: number,
  overage_amount?: number
}
```

#### Billing Portal Endpoints

**POST /billing/portal**
```
Auth: Required (admin/owner only)
Input: {
  return_url?: string
}
Process:
  1. Create Stripe billing portal session
  2. Generate secure portal URL
Response: {
  portal_url: string,
  expires_at: timestamp
}
```

#### Invoice Management Endpoints

**GET /billing/invoices**
```
Auth: Required
Query: {
  page?: number,
  per_page?: number,
  status?: "paid" | "past_due" | "open"
}
Response: {
  invoices: [
    {
      id: number,
      stripe_invoice_id: string,
      invoice_number: string,
      status: string,
      amount_paid: number,
      amount_due: number,
      billing_period_start: timestamp,
      billing_period_end: timestamp,
      due_date: timestamp,
      paid_at: timestamp,
      invoice_pdf_url: string,
      hosted_invoice_url: string
    }
  ],
  total: number,
  page: number
}
```

**GET /billing/invoices/:id**
```
Auth: Required
Response: {
  invoice: Invoice,
  line_items: [
    {
      description: string,
      amount: number,
      quantity: number,
      period_start: timestamp,
      period_end: timestamp
    }
  ]
}
```

#### Webhook Handlers

**POST /webhooks/stripe**
```
Auth: Stripe signature verification
Headers: {
  "stripe-signature": string
}
Process:
  1. Verify Stripe signature
  2. Parse webhook event
  3. Route to appropriate handler
  4. Log event for audit
  5. Return success/failure
Response: {
  received: boolean
}
```

**Webhook Event Handlers:**
- `customer.subscription.created` - Initialize new subscription
- `customer.subscription.updated` - Update subscription status/plan
- `customer.subscription.deleted` - Handle cancellation
- `customer.subscription.trial_will_end` - Send trial ending notification (3 days before)
- `invoice.payment_succeeded` - Mark invoice as paid, reset usage counters
- `invoice.payment_failed` - Handle failed payment, send notifications
- `invoice.created` - Store invoice details
- `customer.subscription.past_due` - Restrict access, send alerts
- `customer.subscription.unpaid` - Suspend workspace after grace period

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
5. Validate MCP tool access on each request
6. Separate workspace keys from tool credentials

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

## 4. Feature Enforcement Middleware

### 4.1 Usage Limit Middleware
```javascript
// Applied to API endpoints that consume resources
function checkUsageLimit(usage_type, increment = 1) {
  return async (req, res, next) => {
    const workspace_id = req.user.workspace_id;
    
    // Check current usage vs limits
    const usage = await getWorkspaceUsage(workspace_id);
    const limits = await getWorkspaceLimits(workspace_id);
    
    if (usage[usage_type] + increment > limits[usage_type]) {
      if (workspace.overage_protection) {
        return res.status(429).json({
          error: "Usage limit exceeded",
          usage_type: usage_type,
          current: usage[usage_type],
          limit: limits[usage_type],
          upgrade_url: "/billing/plans"
        });
      } else {
        // Allow but track overage
        await trackOverage(workspace_id, usage_type, increment);
      }
    }
    
    // Increment usage counter
    await incrementUsage(workspace_id, usage_type, increment);
    next();
  };
}

// Usage in endpoints:
// app.post('/api/keys', checkUsageLimit('api_keys'), createApiKey);
// app.post('/team/invite', checkUsageLimit('team_members'), inviteMember);
// app.use('/api/*', checkUsageLimit('api_calls'), apiRouter);
```

### 4.2 Subscription Status Middleware
```javascript
function requireActiveSubscription() {
  return async (req, res, next) => {
    const workspace = await getWorkspace(req.user.workspace_id);
    
    if (['past_due', 'canceled', 'expired'].includes(workspace.subscription_status)) {
      return res.status(402).json({
        error: "Subscription required",
        status: workspace.subscription_status,
        billing_portal_url: "/billing/portal"
      });
    }
    
    next();
  };
}
```

---

## 5. Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
1. Create workspace and workspace_members tables
2. Extend existing "👤 users" table with workspace_id
3. Modify existing authentication to include workspace context
4. Create workspace management endpoints
5. Ensure isolation between MCP tools (xano, universe, etc.)

### Phase 2: Subscription Foundation (Week 2)
1. Create all billing-related tables
2. Integrate Stripe customer creation with workspace setup
3. Implement subscription plans table and seed data
4. Basic plan limits enforcement
5. Trial period management

### Phase 3: Team Management (Week 3)
1. Implement invitation system
2. Role-based permissions
3. Member management endpoints
4. Email notifications
5. Team member limits based on plan

### Phase 4: Tool Credential Management (Week 4)
1. Xano API key storage and validation
2. Universe connection management  
3. Team sharing capabilities
4. Credential limits per plan
5. Security and encryption

### Phase 5: Billing Integration (Week 5)
1. Stripe webhook handlers implementation
2. Invoice and payment tracking
3. Billing portal integration
4. Payment failure handling
5. Grace period management

### Phase 6: Usage Tracking & Enforcement (Week 6)
1. Real-time usage tracking implementation
2. Usage limit middleware deployment
3. Overage protection and alerts
4. Usage analytics endpoints
5. Dashboard usage widgets

### Phase 7: Advanced Features (Week 7)
1. Usage-based billing for overages
2. Annual plan handling with discounts
3. Team vs individual billing options
4. Self-service plan changes
5. Comprehensive billing history

### Phase 8: MCP Tool Hub Completion (Week 8)
1. Unified connection management for all MCP tools
2. Tool-specific credential handling with plan limits
3. Config generators for each development environment
4. Cross-tool activity tracking and analytics
5. Complete backwards compatibility testing

---

## 6. Performance Optimizations

### 6.1 Database
- Index all foreign keys
- Partition usage tables by month
- Archive old activity logs
- Use materialized views for analytics

### 6.2 Caching
- Cache workspace members (5 min)
- Cache API key lookups (1 min)
- Cache analytics aggregations (15 min)
- Use Redis for session storage

### 6.3 Background Jobs
- Aggregate usage data hourly
- Clean expired invitations daily
- Send activity digests weekly
- Archive old logs monthly

---

## 7. Testing Requirements

### 7.1 Unit Tests
- All authentication flows
- Permission validations
- API key generation
- Data aggregations

### 7.2 Integration Tests
- Full user journey
- Team invitation flow
- API key lifecycle
- Analytics accuracy

### 7.3 Security Tests
- SQL injection prevention
- XSS protection
- Rate limit enforcement
- Token validation

---

## 8. Monitoring & Alerts

### 8.1 Key Metrics
- API response times
- Error rates by endpoint
- Active users per workspace
- API key usage patterns

### 8.2 Alerts
- Failed login attempts > 10/hour
- API errors > 5%
- Database query time > 1s
- Disk usage > 80%

---

## 9. Documentation

### 9.1 API Documentation
- Extend existing Swagger docs for all API groups
- Multi-workspace authentication guide
- MCP tool integration patterns
- Rate limit details per tool

### 9.2 Integration Guides
- Unified MCP tool setup
- Tool-specific credential management
- Cross-tool analytics
- Migration guide for existing users

---

## 10. Key Implementation Considerations

### 10.1 Multi-Tool Architecture
- Each MCP tool maintains its own credential and connection tables
- Unified activity logging across all tools
- Workspace-level isolation for all tool data
- Shared analytics and metrics infrastructure

### 10.2 Credential Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        WORKSPACE                            │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────┐   │
│  │  workspace_members                                  │   │
│  │  ─────────────────                                  │   │
│  │  • User roles and permissions                       │   │
│  │  • tool_permissions: {"xano": ["read", "write"]}    │   │
│  └─────────────────────┘    └─────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Tool-Specific Credentials               │  │
│  │                                                      │  │
│  │  ┌──────────────┐  ┌─────────────────┐  ┌────────┐ │  │
│  │ ┌─────────────────┐ ┌──────────────────┐ ┌────────┐ │  │
│  │ │ xano_api_keys   │ │ xano_credentials │ │universe│ │  │
│  │ │ (NEW)           │ │ (EXISTING)       │ │_conn   │ │  │
│  │ │ • API key hash  │ │ • API key        │ │• Host  │ │  │
│  │ │ • Instance      │ │ • Instance info  │ │• Port  │ │  │
│  │ │ • Shared with   │ └──────────────────┘ │• User  │ │  │
│  │ │   team          │                      │• Pass  │ │  │
│  │ └─────────────────┘                      └────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
1. **No shared API keys**: Each tool has its own credential storage
2. **Tool-specific fields**: Xano needs API keys, Universe needs connection info
3. **Team sharing**: Credentials can be shared with specific team members
4. **Workspace isolation**: All credentials belong to a workspace

### 10.3 Backward Compatibility
- Existing single-user setups continue to work
- Gradual migration path to workspace model
- Preserve existing tool integrations
- Maintain existing API contracts

### 10.4 Special Table Handling
- Tables with emojis require quotes in XanoScript: `db.query "👤 users"`
- Use table IDs for reliable references in code
- Consider creating views with standard names for easier querying

### 10.5 Multi-Tool Access Model
1. **User Level**: Users belong to workspaces
2. **Permission Level**: workspace_members.mcp_tools_access defines which tools each user can access
3. **Tool Level**: Each tool has its own credential table with different fields:
   - **Xano**: API keys (xano_api_keys table)
     - API key hash, instance URL, environment
   - **Universe**: Connection strings (🌐 universe_connections table)  
     - Host, port, username, password, protocol
   - **Airtable**: API keys + base IDs (airtable_credentials table)
     - API key, multiple base IDs
   - **Freshbooks**: OAuth tokens (freshbooks_credentials table)
     - Access token, refresh token, client ID
   - **Stripe**: API keys (stripe_credentials table)
     - Secret key, publishable key, webhook secret
4. **Sharing**: Tool credentials can be shared with specific team members via assigned_to_members field
5. **Isolation**: Each workspace has its own set of saved credentials
6. **Security**: Each tool handles its own credential encryption and validation

---

## Conclusion

This PRD provides a comprehensive backend specification for the MCP Dashboard that extends the existing Xano platform with enterprise-ready features. The design includes:

### Core Features
- **Multi-Workspace Architecture**: Complete workspace isolation with team management
- **Tool-Specific Credentials**: Each MCP tool (xano-turbo, universe, airtable, etc.) maintains its own credential structure
- **Team Collaboration**: Role-based access control with credential sharing
- **Existing Infrastructure Integration**: Leverages current auth system, tables, and MCP tools

### Subscription & Billing System
- **Flexible Plans**: Free, Starter, Pro, and Enterprise tiers with configurable features
- **Usage-Based Limits**: API calls, team members, API keys, and MCP configurations
- **Stripe Integration**: Complete webhook handling for subscription lifecycle
- **Overage Protection**: Configurable blocking or tracking of usage beyond limits
- **Self-Service Management**: Billing portal, plan changes, and invoice history

### Enterprise Features
- **Real-Time Usage Tracking**: Monitor resource consumption across all tools
- **Comprehensive Analytics**: Usage patterns, team activity, and performance metrics
- **Security & Compliance**: Row-level security, audit logs, and encryption
- **Scalability**: Partitioned tables, caching strategies, and performance optimizations

### Implementation Strategy
The 8-week phased implementation ensures:
1. **Backward Compatibility**: Existing single-user setups continue working
2. **Gradual Migration**: Teams can adopt workspace features incrementally
3. **Production Readiness**: Each phase delivers tested, deployable features
4. **Revenue Generation**: Subscription system ready by week 5

This architecture positions the MCP Dashboard as a professional, scalable solution for teams managing Model Context Protocol infrastructure, with clear monetization paths and enterprise-grade features.