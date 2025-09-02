# REALITY CHECK: MCP Dashboard Product Requirements Document

## Executive Summary: What Exists vs What Needs to Be Built

### 🚨 CRITICAL FINDINGS

**The PRD is massively overengineered for what you want to ship ASAP.** The existing Xano backend already has:

1. **User-centric credential storage** - NOT workspace-based
2. **Basic credential management** working for individual users
3. **Analytics and logging** infrastructure already built
4. **No workspace management system** (just 1 endpoint created)
5. **No team/member assignment features** yet

### 🎯 THE BRUTAL TRUTH

The current system is built for **individual users storing their own credentials**, not for **workspace owners assigning credentials to team members**. This is a fundamental architecture mismatch that needs addressing.

## What Actually Exists in Xano

### ✅ Working Tables (Already Built)

1. **xano_credentials** - Stores user's personal API keys
   - Links to individual users (user_id)
   - Has workspace_id field (but not really used)
   - Has `assigned_team_members` JSON field (empty/unused)

2. **xano_api_keys** - Workspace-level API key storage
   - Has proper workspace_id relationship
   - Has `assigned_to_members` JSON field
   - Better structure for team assignment

3. **workspace_members** - Team membership
   - Has role system (owner, admin, member, viewer)
   - Has status (active, invited, disabled)
   - Has `mcp_tools_access` JSON field

4. **workspaces** - Basic workspace container
   - Has billing fields ready
   - Missing many planned features

5. **Analytics tables** - Fully built
   - xano_mcp_logs (detailed logging)
   - xano_mcp_metrics (aggregated metrics)
   - activity_logs (audit trail)
   - api_usage (usage tracking)

### ⚠️ What's Missing (Must Build)

1. **Credential Assignment System** - Zero endpoints exist
2. **Team Management APIs** - Only 1 workspace creation endpoint
3. **OAuth Integration** - No MCP token endpoint
4. **Member Invitation System** - Table exists, no APIs
5. **Dashboard APIs** - Limited to personal analytics

### 🔥 Architecture Conflicts

1. **Two credential tables** doing similar things:
   - `xano_credentials` (user-centric)
   - `xano_api_keys` (workspace-centric)

2. **Assignment mechanism unclear**:
   - JSON arrays vs proper relational tables?
   - Which table is source of truth?

## PHASE 1: Ship in 1-2 Weeks (MVP)

### Core Features ONLY

1. **Simplified Credential Management**
   ```
   - Use xano_api_keys table (workspace-centric)
   - Store credentials per workspace
   - Simple assignment to members
   - Basic on/off access control
   ```

2. **Minimal API Endpoints**
   ```
   POST   /api/credentials              # Save credential
   GET    /api/credentials              # List workspace credentials
   PUT    /api/members/{id}/credential  # Assign credential to member
   DELETE /api/members/{id}/credential  # Remove access
   POST   /api/auth/mcp/token          # OAuth endpoint for MCP tools
   ```

3. **Super Simple Frontend**
   ```
   - Credentials list with "Add New" button
   - Members list with dropdown to assign credential
   - Toggle switch for access on/off
   - That's it. Ship it.
   ```

### What to CUT for MVP

- ❌ Multiple workspace support (hardcode to one)
- ❌ Complex role permissions (owner can do everything)
- ❌ Detailed analytics (just show basic usage count)
- ❌ Billing/subscriptions (add later)
- ❌ Email invitations (just add members directly)
- ❌ Audit logs (nice to have, not critical)
- ❌ Multiple tools support (focus on Xano MCP only)

## PHASE 2: Nice to Have Later

- Multiple workspaces per user
- Proper invitation system
- Detailed usage analytics
- Support for Universe MCP
- Billing integration
- Advanced permissions

## Implementation Plan (1 Week Sprint)

### Day 1-2: Backend APIs
```javascript
// 1. Credential CRUD
POST   /api/workspaces/{id}/credentials
GET    /api/workspaces/{id}/credentials
DELETE /api/credentials/{id}

// 2. Assignment APIs  
GET    /api/workspaces/{id}/members
PUT    /api/members/{id}/assign-credential
DELETE /api/members/{id}/remove-credential

// 3. OAuth Integration
POST   /api/auth/mcp/token
```

### Day 3-4: Frontend MVP
```
- Next.js pages:
  - /dashboard (list credentials & members)
  - /credentials/add (simple form)
  - /members (assignment UI)
```

### Day 5: Integration & Testing
```
- Connect frontend to APIs
- Test OAuth flow with MCP tool
- Basic error handling
```

### Day 6-7: Deploy & Document
```
- Deploy to Vercel
- Write simple setup guide
- Create demo video
```

## Critical Decisions Needed NOW

### 1. Which Credential Table?
**RECOMMENDATION**: Use `xano_api_keys` table
- Already has workspace relationship
- Better field structure
- Designed for this use case

### 2. Assignment Method?
**RECOMMENDATION**: Add new relationship table
```sql
credential_assignments {
  id
  workspace_id
  member_id  
  credential_id
  assigned_at
  assigned_by
}
```
This is cleaner than JSON arrays.

### 3. Single vs Multi Tool?
**RECOMMENDATION**: Xano MCP only for MVP
- Ship one thing that works perfectly
- Add other tools after you have customers

## Xano-Specific Implementation Notes

### Existing Endpoints to Leverage

1. **Authentication** - Magic Link system already built
2. **Analytics** - Complete logging system ready
3. **User Management** - Basic user table with auth

### New Endpoints Needed (XanoScript)

```javascript
// 1. Save Workspace Credential
create('credentials', 'POST')
  .requiresAuth('👤 users')
  .input('name', 'text')
  .input('api_key', 'text')
  .precondition('$auth.role === "owner"', 'Only owners can add credentials')
  .dbAdd('xano_api_keys', {
    workspace_id: '$auth.workspace_id',
    name: '$input.name',
    key_hash: '$input.api_key|sha256',
    key_prefix: '$input.api_key|substr:0:8',
    status: 'active'
  })
  .response({ success: true });

// 2. Assign Credential
create('assign-credential', 'PUT')
  .requiresAuth('👤 users')
  .input('member_id', 'int')
  .input('credential_id', 'int')
  .dbEdit('workspace_members', 
    { id: '$input.member_id' },
    { assigned_credential_id: '$input.credential_id' }
  )
  .response({ success: true });

// 3. OAuth Token Endpoint  
create('mcp-token', 'POST')
  .requiresAuth('👤 users')
  .dbGet('workspace_members', { user_id: '$auth.id' }, 'membership')
  .dbGet('xano_api_keys', { id: '$membership.assigned_credential_id' }, 'credential')
  .conditional('$credential !== null')
    .then(e => e.response({ 
      credential: { 
        type: 'xano_api_key',
        value: '$credential.actual_key' 
      }
    }))
    .else(e => e.error(403, 'No credential assigned'));
```

## The REAL MVP Feature List

### Must Have (Week 1)
- [ ] Store multiple Xano API keys per workspace
- [ ] Assign one key to each team member
- [ ] OAuth endpoint returns assigned key
- [ ] Basic UI to manage this

### Should Have (Week 2)
- [ ] See who's using which credential
- [ ] Basic usage count per credential
- [ ] Revoke access ability

### Could Have (Month 2)
- [ ] Multiple workspaces
- [ ] Other MCP tools
- [ ] Detailed analytics
- [ ] Billing

## Final Recommendations

### 1. Simplify the Architecture
- One workspace per account initially
- Direct credential-to-member assignment
- No complex permission logic

### 2. Use What's Built
- Leverage existing auth system
- Use existing analytics tables
- Don't rebuild what works

### 3. Ship Fast
- 5-7 days to working product
- Get customer feedback
- Iterate based on real usage

### 4. Marketing Copy
"Let your team use your Xano MCP credentials without sharing API keys. Assign access, track usage, revoke anytime. That's it."

## Conclusion

The original PRD describes a Ferrari when you need a skateboard. The existing Xano backend has good bones but needs pivoting from individual to team use. With focused effort on just credential assignment, this can ship in a week and start generating revenue immediately.

**Bottom Line**: Cut 80% of features, focus on core value prop, ship in 7 days.