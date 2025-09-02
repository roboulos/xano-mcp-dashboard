# Xano MCP Dashboard Routes PRD
## Secure Credential Management Platform for MCP Tools

### Executive Summary

This PRD defines all routes required for the Xano MCP Dashboard - a secure credential management and oversight platform that enables teams to:
- Store and manage API credentials for various services (Xano, Airtable, Stripe, etc.)
- Assign credentials to team members
- Allow external MCP tools to securely retrieve their assigned credentials
- Monitor usage, track activity, and maintain security oversight

**Current Status**: 80% MVP Complete
**Architecture**: The dashboard is a standalone Next.js application that manages credentials. MCP tools are separate applications that authenticate to retrieve their assigned credentials.

---

## 1. System Architecture Overview

### Components:
1. **Dashboard (This Project)**: Web application for credential management and oversight
2. **MCP Tools (External)**: Separate tools/applications that need API credentials to operate
3. **Xano Backend**: API backend (Workspace 5) storing credentials and handling authentication

### Key Flows:
1. **Admin Flow**: Dashboard → Create/manage credentials → Assign to team members
2. **MCP Tool Flow**: External MCP tool → Authenticate to dashboard → Retrieve assigned credential → Use credential in their own operations

---

## 2. Route Categories and Priorities

### Priority Levels:
- **P0**: MVP Critical (Complete the remaining 20%)
- **P1**: MVP Enhancement (Better UX/features)
- **P2**: Post-MVP (Advanced features)

---

## 3. Frontend Routes (Pages)

### 3.1 Authentication Pages (P0)
```typescript
// Public pages - redirects to dashboard if authenticated
GET /login                    // User sign-in page
GET /signup                   // New user registration  
GET /forgot-password          // Password reset request
GET /reset-password          // Password reset completion
```

### 3.2 Dashboard Pages (P0)
```typescript
// All require authentication via middleware
GET /dashboard               // Overview: credentials summary, recent activity
GET /dashboard/credentials   // List all workspace credentials
GET /dashboard/credentials/new // Create new credential form
GET /dashboard/credentials/[id] // View/edit specific credential (P1)

GET /dashboard/members       // List workspace members & their assignments
GET /dashboard/members/[id]  // Member detail & credential assignment

GET /dashboard/developers    // MCP integration guide & token retrieval
GET /dashboard/activity      // Activity logs and audit trail (P1)
```

### 3.3 Settings & Admin (P1)
```typescript
GET /dashboard/settings              // Workspace settings
GET /dashboard/settings/security     // Security settings (2FA, IP whitelist)
GET /dashboard/settings/webhooks     // Webhook configuration
GET /dashboard/settings/team         // Team management
GET /dashboard/settings/billing      // Subscription management (P2)
```

### 3.4 Analytics & Monitoring (P1)
```typescript
GET /dashboard/analytics            // Usage analytics overview
GET /dashboard/analytics/usage      // Detailed usage by tool/member
GET /dashboard/analytics/errors     // Error tracking and alerts
```

---

## 4. API Routes (Next.js Backend for Frontend)

### 4.1 Authentication Endpoints (P0)

#### POST /api/auth/login
```typescript
// Sign in existing user
Request: {
  email: string
  password: string
}
Response: {
  user: {
    id: string
    email: string
    name: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
  }
  workspace: {
    id: number
    name: string
    subscription_tier: string
  }
  token: string
}
// Sets httpOnly cookie: authToken
```

#### POST /api/auth/signup
```typescript
// Register new user and workspace
Request: {
  email: string
  password: string
  name: string
  workspace_name: string
  company?: string
}
Response: {
  user: User
  workspace: Workspace
  token: string
}
// Sets httpOnly cookie: authToken
```

#### POST /api/auth/logout
```typescript
// Clear authentication
Response: { success: true }
// Clears authToken cookie
```

#### GET /api/auth/me
```typescript
// Get current user context
Response: {
  user: User
  workspace: Workspace
  permissions: string[]
}
Auth: Required
```

### 4.2 Credential Management (P0)

#### GET /api/credentials
```typescript
// List all workspace credentials
Response: {
  credentials: [{
    id: number
    name: string
    type: 'xano' | 'airtable' | 'stripe' | 'freshbooks' | 'universe'
    description?: string
    key_prefix: string  // First 8 chars only
    instance_url?: string
    environment: 'production' | 'staging' | 'development'
    status: 'active' | 'revoked'
    created_at: string
    created_by: { id: string, name: string }
    assigned_count: number
    last_used_at?: string
    usage_count: number
  }]
  total: number
}
Auth: Required
```

#### POST /api/credentials
```typescript
// Create new credential
Request: {
  name: string
  type: 'xano' | 'airtable' | 'stripe' | 'freshbooks' | 'universe'
  api_key: string  // Will be encrypted
  description?: string
  instance_url?: string
  environment: 'production' | 'staging' | 'development'
  metadata?: {  // Type-specific fields
    base_ids?: string[]  // For Airtable
    account_id?: string  // For Freshbooks
  }
}
Response: {
  credential: {
    id: number
    name: string
    key_prefix: string
    // ... other fields (no full key returned)
  }
}
Auth: Required (owner/admin only)
```

#### PUT /api/credentials/[id]
```typescript
// Update credential metadata (cannot update key)
Request: {
  name?: string
  description?: string
  environment?: string
  status?: 'active' | 'revoked'
}
Auth: Required (owner/admin only)
```

#### DELETE /api/credentials/[id]
```typescript
// Soft delete credential
Response: { success: true }
Auth: Required (owner/admin only)
```

### 4.3 Member Management (P0)

#### GET /api/members
```typescript
// List workspace members with assignments
Response: {
  members: [{
    id: number
    user: {
      id: string
      email: string
      name: string
      avatar_url?: string
    }
    role: 'owner' | 'admin' | 'member' | 'viewer'
    status: 'active' | 'invited' | 'suspended'
    joined_at: string
    last_active_at?: string
    assigned_credentials: [{
      id: number
      name: string
      type: string
      key_prefix: string
      assigned_at: string
      last_used_at?: string
    }]
  }]
  total: number
}
Auth: Required
```

#### PUT /api/members/[id]/assign-credential
```typescript
// Assign credential to member
Request: {
  credential_id: number
}
Response: {
  success: true
  assignment: {
    member_id: number
    credential_id: number
    assigned_at: string
    assigned_by: string
  }
}
Auth: Required (owner/admin only)
```

#### DELETE /api/members/[id]/credentials/[credentialId]
```typescript
// Revoke credential assignment
Response: { success: true }
Auth: Required (owner/admin only)
```

### 4.4 MCP Tool Authentication (P0)

#### POST /api/mcp/auth/token
```typescript
// MCP tools call this to get their assigned credential
// This is THE critical endpoint for MCP tool integration
Request: {
  // MCP tool authenticates with their user token
}
Headers: {
  Authorization: 'Bearer <mcp-user-token>'
}
Response: {
  credential: {
    id: number
    name: string
    type: string
    api_key: string  // Actual decrypted key returned ONLY here
    instance_url?: string
    environment: string
    metadata?: object  // Type-specific data
  }
  issued_at: string
  expires_at?: string
  usage: {
    count_today: number
    count_this_month: number
    last_used_at?: string
  }
}
Auth: Required (valid MCP tool token)
```

### 4.5 Activity & Monitoring (P1)

#### GET /api/activity
```typescript
// Activity log
Query: {
  type?: 'credential_created' | 'credential_assigned' | 'token_retrieved' | 'credential_revoked'
  user_id?: string
  credential_id?: number
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}
Response: {
  activities: [{
    id: number
    type: string
    description: string
    user: { id: string, name: string }
    credential?: { id: number, name: string }
    metadata?: object
    ip_address?: string
    user_agent?: string
    created_at: string
  }]
  total: number
}
Auth: Required
```

#### GET /api/analytics/usage
```typescript
// Usage analytics
Query: {
  period: 'day' | 'week' | 'month'
  start_date?: string
  end_date?: string
}
Response: {
  usage: {
    total_retrievals: number
    by_credential: [{ id: number, name: string, count: number }]
    by_member: [{ id: number, name: string, count: number }]
    by_day: [{ date: string, count: number }]
  }
}
Auth: Required
```

### 4.6 Workspace Settings (P1)

#### GET /api/workspace/settings
```typescript
Response: {
  workspace: {
    id: number
    name: string
    settings: {
      allow_api_key_creation: boolean
      require_2fa: boolean
      ip_whitelist?: string[]
      webhook_url?: string
      notification_email?: string
    }
  }
}
Auth: Required (owner/admin)
```

#### PUT /api/workspace/settings
```typescript
Request: {
  name?: string
  settings?: {
    allow_api_key_creation?: boolean
    require_2fa?: boolean
    ip_whitelist?: string[]
    webhook_url?: string
  }
}
Auth: Required (owner/admin)
```

---

## 5. Xano Backend Endpoints (Workspace 5)

### 5.1 Existing Endpoints (Already Implemented)
- `POST /api:4ir_LaU4/credentials` (ID: 17895) - Create credential
- `GET /api:4ir_LaU4/credentials` (ID: 17896) - List credentials
- `PUT /api:4ir_LaU4/members/{id}/credential` (ID: 17899) - Assign credential
- `POST /api:4ir_LaU4/auth/mcp-token` (ID: 17900) - MCP token retrieval

### 5.2 Required Endpoints (P0 - Complete MVP)
```typescript
GET /api:4ir_LaU4/members
// List members with credential assignments
// CRITICAL: This is the main gap preventing MVP completion

PUT /api:4ir_LaU4/credentials/{id}
// Update credential metadata

GET /api:4ir_LaU4/activity
// Activity logs

POST /api:4ir_LaU4/auth/signup
// User registration with workspace creation
```

### 5.3 Enhancement Endpoints (P1)
```typescript
GET /api:4ir_LaU4/analytics/usage
GET /api:4ir_LaU4/analytics/overview
GET /api:4ir_LaU4/workspace/settings
PUT /api:4ir_LaU4/workspace/settings
```

---

## 6. Authentication & Security Model

### 6.1 User Authentication
- **Storage**: JWT token in httpOnly cookie (`authToken`)
- **Validation**: Middleware checks cookie on protected routes
- **API Calls**: Bearer token in Authorization header

### 6.2 MCP Tool Authentication
- **Separate Flow**: MCP tools use their own authentication token
- **Credential Retrieval**: Only via `/api/mcp/auth/token` endpoint
- **Security**: Actual API keys NEVER exposed except to authenticated MCP tools

### 6.3 Role-Based Access
```typescript
type Role = 'owner' | 'admin' | 'member' | 'viewer'

Permissions:
- owner: Full access
- admin: Manage credentials and assignments
- member: View credentials, use MCP token endpoint
- viewer: Read-only access
```

### 6.4 Credential Security
1. **Storage**: API keys encrypted at rest (AES-256-GCM)
2. **Display**: Only show first 8 characters (prefix)
3. **Retrieval**: Full key ONLY via MCP token endpoint
4. **Audit**: All access logged with IP, timestamp, user

---

## 7. Data Flow Diagrams

### 7.1 Credential Creation Flow
```
Admin Dashboard → POST /api/credentials → Xano Backend
                                         ↓
                                    Encrypt API key
                                         ↓
                                    Store in xano_api_keys
                                         ↓
                                    Log activity
                                         ↓
                                    Return masked credential
```

### 7.2 MCP Tool Credential Retrieval
```
MCP Tool → POST /api/mcp/auth/token → Verify MCP user token
                                    ↓
                              Find user's assignment
                                    ↓
                              Decrypt API key
                                    ↓
                              Update usage stats
                                    ↓
                              Log retrieval
                                    ↓
                              Return full credential
```

---

## 8. MVP Completion Checklist (Remaining 20%)

### Backend (Xano)
- [ ] Implement `GET /api:4ir_LaU4/members` endpoint
- [ ] Add encryption/decryption for API keys in `mcp-token` endpoint
- [ ] Ensure activity logging for all credential operations
- [ ] Add proper error responses with consistent schema

### Frontend (Next.js)
- [ ] Complete `/dashboard/members` page with assignment UI
- [ ] Implement `/dashboard/credentials` list and create pages
- [ ] Add "Get MCP Token" documentation to `/dashboard/developers`
- [ ] Wire up all API proxy endpoints listed in section 4

### Security
- [ ] Implement API key encryption service
- [ ] Add rate limiting to MCP token endpoint
- [ ] Ensure all admin endpoints check role permissions
- [ ] Add IP logging for audit trail

### Testing
- [ ] End-to-end flow: Create → Assign → Retrieve
- [ ] Permission testing (admin vs member access)
- [ ] MCP tool authentication flow
- [ ] Error handling for all edge cases

---

## 9. Post-MVP Roadmap (P1/P2)

### Phase 1 (P1) - Enhanced Management
- Activity logs and audit trail UI
- Usage analytics dashboard
- Workspace settings management
- Team invitation system
- Webhook notifications

### Phase 2 (P2) - Advanced Features
- Multi-tool credential support (Universe, Airtable, etc.)
- Billing and subscription management
- Usage-based limits and alerts
- Advanced security (2FA, IP restrictions)
- Credential rotation scheduling
- API key expiration policies

---

## 10. Technical Specifications

### API Response Format
```typescript
// Success
{
  data: T,
  meta?: {
    page?: number
    total?: number
    limit?: number
  }
}

// Error
{
  error: {
    code: string
    message: string
    details?: object
  }
}
```

### Standard Error Codes
- `AUTH_REQUIRED` - No authentication provided
- `PERMISSION_DENIED` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input
- `RATE_LIMITED` - Too many requests
- `CREDENTIAL_REVOKED` - Attempting to use revoked credential
- `NO_ASSIGNMENT` - User has no credential assigned

### Security Headers
```typescript
headers: {
  'Authorization': 'Bearer <token>',
  'X-Request-ID': '<uuid>',
  'X-API-Version': '1.0'
}
```

---

This PRD clearly separates the dashboard (credential management platform) from the MCP tools (external applications), focusing on secure storage, team management, and controlled access to credentials. The dashboard provides the oversight and security layer while MCP tools operate independently using the credentials they retrieve.