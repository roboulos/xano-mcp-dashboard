# 📋 PRD: API Key Member Assignment System

## 🎯 Problem Statement
Currently, members cannot be assigned to API keys because the backend endpoint is broken. This prevents MCP OAuth flow from working since it can't determine which API key to use for each member.

## 🚀 Objective  
Enable workspace admins to assign members to API keys so that MCP OAuth authentication works properly for each team member.

## 📊 Current State vs Target State

### Current State ❌
- Members can create/save API keys ✅
- Members CANNOT be assigned to API keys (broken endpoint)
- No member selection UI when managing API keys
- MCP OAuth flow fails (can't find member's assigned key)

### Target State ✅
- Members can be assigned to exactly ONE active API key
- UI shows member selection when managing API keys
- MCP OAuth flow works (finds member's active key via email)
- Admins can reassign members to different keys

## 🔧 Technical Requirements

### Backend Fixes Needed
1. **Fix broken `/members/{id}/credential` endpoint**
   - Currently returns "Invalid dbo id: 789"
   - Should update `credential_assignments` table
   - Set one credential as active per member

2. **Build missing endpoints:**
   - `GET /workspaces/{id}/members` - List available members for assignment
   - `GET /credentials/{id}/assigned-members` - Show who's using this key
   - `POST /credentials/{id}/assign-member` - Assign member to this key
   - `DELETE /credentials/{id}/unassign-member` - Remove member from key

### Frontend Requirements
1. **Member Selection Dropdown**
   - Show when adding/editing API keys
   - Display: Member name, email, current assignment status
   - Allow selecting multiple members for bulk assignment

2. **Assignment Management View**
   - Show which members are assigned to each API key
   - Allow reassigning members to different keys
   - Show unassigned members prominently

3. **Member Status Indicators**
   - ✅ "Assigned to [Key Name]"
   - ⚠️ "No API key assigned"
   - 🔄 "Reassign" action buttons

## 🛠 Implementation Plan

### Phase 1: Fix Backend (Priority 1)
1. **Diagnose and fix "Invalid dbo id: 789" error** in workspace management endpoints
2. **Test credential assignment flow** end-to-end
3. **Verify MCP OAuth endpoint** can find assigned keys by email

### Phase 2: Build Missing Endpoints (Priority 1) 
1. Member listing endpoints for UI dropdowns
2. Assignment management endpoints
3. Bulk assignment capabilities

### Phase 3: Frontend Integration (Priority 2)
1. Add member selection to API key creation/edit forms
2. Build assignment management dashboard
3. Add member status indicators throughout UI

## 🎯 Success Criteria
- ✅ Admin can assign any member to any API key
- ✅ Member can only have ONE active API key at a time  
- ✅ MCP OAuth flow finds correct API key by member email
- ✅ UI clearly shows assignment status for all members
- ✅ Reassignment works without breaking existing functionality

## 🚨 Risks & Mitigation
- **Risk**: Breaking existing credential functionality
- **Mitigation**: Test existing endpoints before/after fixes
- **Risk**: Members getting locked out during reassignment  
- **Mitigation**: Always require at least one admin with working key

## 📈 Metrics
- Assignment completion rate (members with keys assigned)
- MCP OAuth success rate post-implementation  
- Time to assign new team members to keys

## 🔗 Next Steps
Ready to proceed with Phase 1 backend fixes using the Xano backend developer agent.