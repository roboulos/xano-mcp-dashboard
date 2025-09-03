# 🧪 Dummy Data Reference for API Testing

## 👤 Primary Test User
- **Name**: Robert J. Boulos
- **Email**: robertjboulos@gmail.com
- **User ID**: `17b6fc02-966c-4642-babe-e8004afffc46`

## 🏢 Workspaces

### Workspace ID 5 - "Acme Corp Development" (Primary Test Workspace)
```json
{
  "id": 5,
  "name": "Acme Corp Development",
  "slug": "acme-dev",
  "owner_id": "17b6fc02-966c-4642-babe-e8004afffc46",
  "subscription_plan": "pro",
  "status": "active"
}
```

### Workspace ID 6 - "TechFlow Solutions"
```json
{
  "id": 6,
  "name": "TechFlow Solutions", 
  "slug": "techflow",
  "owner_id": "17b6fc02-966c-4642-babe-e8004afffc46",
  "subscription_plan": "starter",
  "status": "trial"
}
```

### Workspace ID 7 - "Beta Testing Environment"
```json
{
  "id": 7,
  "name": "Beta Testing Environment",
  "slug": "beta-env", 
  "owner_id": "17b6fc02-966c-4642-babe-e8004afffc46",
  "subscription_plan": "enterprise",
  "status": "active"
}
```

## 👥 Workspace Members

### Member ID 5 (Primary Test Member)
```json
{
  "id": 5,
  "workspace_id": 5,
  "user_id": "17b6fc02-966c-4642-babe-e8004afffc46",
  "role": "owner",
  "status": "active",
  "mcp_tools_access": ["xano-turbo", "stripe", "freshbooks", "gmail"],
  "credential_ref": 17
}
```

## 🔑 API Credentials

### Credential ID 17 - "Production API" (Primary Test Credential)
```json
{
  "id": 17,
  "credential_name": "Production API",
  "xano_api_key": "xano_api_key_prod_123456789abcdefghij",
  "xano_instance_url": "acme-prod-v2z8",
  "xano_workspace_id": "5",
  "api_email": "api@acmecorp.com",
  "is_default": true,
  "is_active": true,
  "user_id": "17b6fc02-966c-4642-babe-e8004afffc46",
  "workspace_id": 5,
  "assigned_team_members": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ]
}
```

---

## 📋 Sample Test Payloads

### 1. Get Workspace Members
```bash
GET /workspaces/5/members
Authorization: Bearer <your_auth_token>
```

**Expected Response**:
```json
{
  "items": [
    {
      "id": 5,
      "workspace_id": 5,
      "user_id": "17b6fc02-966c-4642-babe-e8004afffc46",
      "role": "owner",
      "status": "active",
      "mcp_tools_access": ["xano-turbo", "stripe", "freshbooks", "gmail"],
      "credential_ref": 17
    }
  ]
}
```

### 2. Assign Member to Credential
```bash
POST /credentials/17/assign-member
Authorization: Bearer <your_auth_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "member_id": 5
}
```

**Expected Response**:
```json
{
  "id": 5,
  "workspace_id": 5,
  "user_id": "17b6fc02-966c-4642-babe-e8004afffc46",
  "role": "owner",
  "status": "active",
  "credential_ref": 17
}
```

### 3. Get Assigned Members for Credential
```bash
GET /credentials/17/assigned-members
Authorization: Bearer <your_auth_token>
```

**Expected Response**:
```json
{
  "items": [
    {
      "id": 5,
      "workspace_id": 5,
      "user_id": "17b6fc02-966c-4642-babe-e8004afffc46",
      "role": "owner", 
      "status": "active",
      "mcp_tools_access": ["xano-turbo", "stripe", "freshbooks", "gmail"],
      "credential_ref": 17
    }
  ]
}
```

### 4. Unassign Member from Credential
```bash
DELETE /credentials/17/unassign-member
Authorization: Bearer <your_auth_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "member_id": 5
}
```

**Expected Response**:
```json
{
  "id": 5,
  "workspace_id": 5,
  "user_id": "17b6fc02-966c-4642-babe-e8004afffc46",
  "role": "owner",
  "status": "active",
  "credential_ref": null
}
```

---

## 🎯 Quick Test Scenarios

### Scenario 1: Member Assignment Flow
1. **Get members**: `GET /workspaces/5/members`
2. **Assign member to credential**: `POST /credentials/17/assign-member` with `{"member_id": 5}`
3. **Verify assignment**: `GET /credentials/17/assigned-members`
4. **Test unassignment**: `DELETE /credentials/17/unassign-member` with `{"member_id": 5}`

### Scenario 2: Multi-Workspace Testing
- Use workspace IDs: `5`, `6`, `7` for different subscription plans and statuses
- Test with different member roles and permissions

### Scenario 3: MCP OAuth Flow
- User authenticates with email: `robertjboulos@gmail.com`
- System should find `credential_ref: 17` for this user
- Should return API key: `xano_api_key_prod_123456789abcdefghij`

---

## 📊 Additional Test Data

### Activity Logs (4 records available)
- Credential assignments
- Workspace creation events  
- MCP tool usage tracking
- Real xano-turbo tool interactions

### Available MCP Tools
- `xano-turbo` (active)
- `stripe` (active)
- `freshbooks` (active)
- `gmail` (active)

### Subscription Plans
- **Starter**: Basic features, trial status
- **Pro**: Full features, active status  
- **Enterprise**: Advanced features, active status

---

## 🌐 API Base URLs

### Workspace Management
- Base: `https://xnwv-v1z6-dvnr.n7c.xano.io/api:4ir_LaU4`
- Auth: Bearer token from users table

### Credentials Management  
- Base: `https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r`
- Auth: Bearer token from users table

### Authentication
- Base: `https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3`

---

## ⚠️ Important Notes

1. **Always use the exact IDs provided** - these are the actual records in the database
2. **Member ID vs User ID**: Member ID `5` is the workspace member record, User ID is the UUID
3. **Credential assignments** use the `credential_ref` field, not `assigned_credential_id`
4. **MCP OAuth** looks up users by email and returns their `credential_ref` credential
5. **Authentication required** for all endpoints using Bearer tokens