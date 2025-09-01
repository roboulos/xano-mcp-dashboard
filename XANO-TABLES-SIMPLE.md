# Xano Tables Implementation Guide

## Overview
This document lists only the tables that need to be created in Xano for the MCP Dashboard. Uses existing Xano workspace structure.

---

## 1. Core Tables to Create

### workspaces
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

### workspace_members
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- role (enum: owner, admin, member, viewer)
- status (enum: active, invited, disabled)
- mcp_tools_access (json, array) // ["xano-turbo", "universe"]
- invited_by (uuid, reference to "👤 users".id, nullable)
- invitation_token (text, nullable)
- invitation_expires (timestamp, nullable)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

### xano_api_keys
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- name (text, required)
- description (text, nullable)
- key_prefix (text, required) // First 8 chars for display
- key_hash (text, required) // SHA-256 hash of full key
- xano_instance (text, required)
- environment (enum: production, staging, development)
- assigned_to_members (json, array of user_ids)
- status (enum: active, revoked, expired)
- last_used_at (timestamp, nullable)
- usage_count (int, default: 0)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

### mcp_connections
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- name (text, required)
- tool_type (enum: claude-desktop, claude-code, cursor, generic)
- mcp_tool (enum: xano-turbo, universe, airtable, freshbooks, stripe)
- environment (enum: production, staging, development)
- config (json, encrypted)
- credential_reference (json) // {"table": "xano_credentials", "id": 123}
- status (enum: active, inactive)
- created_by (uuid, reference to "👤 users".id)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

### activity_logs
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id, nullable)
- tool_credential_id (int, nullable)
- action (text, required)
- resource_type (text, nullable)
- resource_id (int, nullable)
- mcp_tool (text, nullable)
- metadata (json, nullable)
- ip_address (text, nullable)
- created_at (timestamp, default: now())
```

### api_usage
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- api_key_id (int, reference to xano_api_keys.id)
- endpoint (text, required)
- method (text, required)
- status_code (int, required)
- response_time_ms (int, required)
- created_at (timestamp, default: now())
```

---

## 2. Supporting Tables

### workspace_invitations
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- email (email, required)
- role (enum: admin, member, viewer)
- token (text, unique, required)
- invited_by (uuid, reference to "👤 users".id)
- expires_at (timestamp, required)
- accepted_at (timestamp, nullable)
- created_at (timestamp, default: now())
```

### workspace_settings
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

## 3. Updates to Existing Tables

### "👤 users" table - ADD these fields:
```
- workspace_id (int, reference to workspaces.id)
- avatar_url (text, nullable)
```

### xano_credentials table - ADD these fields:
```
- workspace_id (int, reference to workspaces.id)
- assigned_team_members (json, array of user_ids)
```

---

## 4. Other Tool Credential Tables (Create as needed)

### airtable_credentials
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- name (text, required)
- api_key_hash (text, required)
- base_ids (json, array)
- assigned_to_members (json, array of user_ids)
- status (enum: active, revoked)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

### freshbooks_credentials
```
- id (int, primary key, auto-increment)
- workspace_id (int, reference to workspaces.id)
- user_id (uuid, reference to "👤 users".id)
- name (text, required)
- client_id (text, required)
- access_token (text, encrypted)
- refresh_token (text, encrypted)
- token_expires_at (timestamp)
- account_id (text)
- assigned_to_members (json, array of user_ids)
- status (enum: active, revoked, expired)
- created_at (timestamp, default: now())
- updated_at (timestamp, default: now())
```

---

## 5. Implementation Notes

### Order of Creation:
1. Create `workspaces` table first
2. Update existing "👤 users" table
3. Create `workspace_members` table
4. Create all credential tables
5. Create supporting tables

### Important Considerations:
- All tables need workspace_id for multi-tenancy
- Use UUID for user references (matches existing "👤 users" table)
- Encrypt sensitive data (API keys, tokens)
- Add indexes on foreign keys and commonly queried fields
- Each MCP tool gets its own credential table

### Existing Tables to Leverage:
- "👤 users" (auth enabled)
- xano_credentials
- "🌐 universe_connections"
- xano_mcp_logs
- xano_mcp_metrics

---

## Summary

**Total New Tables**: 8 core tables + credential tables as needed
**Tables to Modify**: 2 ("👤 users" and xano_credentials)
**Key Pattern**: Everything is workspace-scoped for multi-tenancy