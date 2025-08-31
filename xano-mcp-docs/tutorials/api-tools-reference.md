# Xano MCP API Tools Reference

Complete documentation for all 93+ MCP tools available for building Xano backends.

## Tool Categories Overview

1. **Database Operations** - Table and record management
2. **API Management** - Endpoints and logic
3. **Authentication & Security** - User auth and permissions
4. **File Operations** - File uploads and storage
5. **Task Management** - Background jobs and scheduling
6. **Function Management** - Custom functions
7. **High-Level Tools** - SDK-powered abstractions
8. **Templates** - Pre-built patterns
9. **Utility Tools** - Helpers and utilities

## 1. Database Operations

### Table Management

#### `xano_list_tables`
Lists all tables in a workspace.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `page` (number, optional): Page number (default: 1)
- `per_page` (number, optional): Results per page (default: 50)

**Returns:**
```json
{
  "items": [
    {
      "id": 123,
      "name": "users",
      "auth": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5
}
```

**Example:**
```javascript
const tables = await xano_list_tables({
  instance_name: "my-instance",
  workspace_id: 1
});
```

---

#### `xano_create_table`
Creates a new database table.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `name` (string): Table name
- `auth` (boolean, optional): Enable authentication (default: false)
- `description` (string, optional): Table description

**Example:**
```javascript
await xano_create_table({
  instance_name: "my-instance",
  workspace_id: 1,
  name: "products",
  auth: false,
  description: "Product catalog"
});
```

---

#### `xano_get_table_details`
Get detailed information about a table.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID

**Returns:**
```json
{
  "id": 123,
  "name": "users",
  "auth": true,
  "fields": [...],
  "indexes": [...],
  "record_count": 1500
}
```

---

#### `xano_delete_table`
Permanently delete a table and all its data.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID

**⚠️ Warning:** This operation cannot be undone!

---

#### `xano_truncate_table`
Remove all records from a table while keeping structure.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `reset` (boolean, optional): Reset auto-increment (default: false)

### Schema Management

#### `xano_add_field_to_schema`
Add a new field to an existing table.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `field_name` (string): Field name
- `field_type` (string): Type (text, int, decimal, bool, timestamp, etc.)
- `required` (boolean, optional): Make field required
- `default_value` (any, optional): Default value

**Field Types:**
- `text` - String data
- `int` - Integer numbers
- `decimal` - Decimal numbers
- `bool` - Boolean (true/false)
- `timestamp` - Date and time
- `date` - Date only
- `time` - Time only
- `email` - Email validation
- `password` - Auto-hashed password
- `enum` - Enumerated values
- `file` - File upload
- `image` - Image upload
- `object` - JSON object
- `array` - JSON array

**Example:**
```javascript
await xano_add_field_to_schema({
  instance_name: "my-instance",
  workspace_id: 1,
  table_id: 123,
  field_name: "status",
  field_type: "enum",
  validators: {
    values: ["active", "inactive", "pending"]
  },
  default_value: "pending"
});
```

---

#### `xano_rename_schema_field`
Rename an existing field.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `old_name` (string): Current field name
- `new_name` (string): New field name

---

#### `xano_delete_field`
Remove a field from table schema.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `field_name` (string): Field to delete

### Record Operations

#### `xano_browse_table_content`
Browse table records with pagination.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `page` (number, optional): Page number
- `per_page` (number, optional): Records per page (max: 100)

**Returns:**
```json
{
  "items": [...],
  "curPage": 1,
  "nextPage": 2,
  "totalPages": 10,
  "itemsTotal": 500
}
```

---

#### `xano_get_table_record`
Get a single record by ID.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `record_id` (number): Record ID

---

#### `xano_create_table_record`
Create a new record.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `record_data` (object): Record data

**Example:**
```javascript
const newUser = await xano_create_table_record({
  instance_name: "my-instance",
  workspace_id: 1,
  table_id: 123,
  record_data: {
    name: "John Doe",
    email: "john@example.com",
    status: "active"
  }
});
```

---

#### `xano_update_table_record`
Update an existing record.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `record_id` (number): Record ID
- `record_data` (object): Updated data

---

#### `xano_delete_table_record`
Delete a record.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `record_id` (number): Record ID

### Index Management

#### `xano_manage_table_indexes`
Create, list, or delete table indexes.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table_id` (number): Table ID
- `action` (string): "list", "create", or "delete"
- `fields` (array, optional): Fields for index creation
- `type` (string, optional): "btree", "unique", or "btree|unique"
- `index_id` (number, optional): For deletion

**Example:**
```javascript
// Create composite index
await xano_manage_table_indexes({
  instance_name: "my-instance",
  workspace_id: 1,
  table_id: 123,
  action: "create",
  fields: [
    { name: "user_id", op: "asc" },
    { name: "created_at", op: "desc" }
  ],
  type: "btree"
});
```

## 2. API Management

### API Groups

#### `xano_browse_api_groups`
List all API groups in workspace.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `page` (number, optional): Page number
- `per_page` (number, optional): Results per page

---

#### `xano_create_api_group`
Create a new API group.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `name` (string): Group name
- `description` (string, optional): Description
- `swagger` (boolean, optional): Enable OpenAPI docs

**Example:**
```javascript
const group = await xano_create_api_group({
  instance_name: "my-instance",
  workspace_id: 1,
  name: "Public API",
  description: "Customer-facing endpoints",
  swagger: true
});
```

---

#### `xano_get_api_group`
Get API group details.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID

---

#### `xano_update_api_group`
Update API group settings.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID
- `name` (string, optional): New name
- `description` (string, optional): New description
- `swagger` (boolean, optional): OpenAPI setting

---

#### `xano_delete_api_group`
Delete an API group and all its endpoints.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID

### API Endpoints

#### `xano_browse_apis_in_group`
List all endpoints in an API group.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID

---

#### `xano_get_api`
Get endpoint details.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID
- `api_id` (number): API endpoint ID

---

#### `xano_get_api_with_logic`
Get endpoint with XanoScript logic.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID
- `api_id` (number): API endpoint ID
- `type` (string, optional): Format ("xs", "yaml", "json")

**Returns:**
```json
{
  "id": 456,
  "name": "Get Users",
  "path": "/users",
  "method": "GET",
  "script": "query users verb=GET {...}"
}
```

---

#### `xano_update_api`
Update endpoint configuration.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID
- `api_id` (number): API endpoint ID
- `name` (string, optional): New name
- `path` (string, optional): New path
- `verb` (string, optional): HTTP method
- `description` (string, optional): Description

---

#### `xano_delete_api`
Delete an API endpoint.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID
- `api_id` (number): API endpoint ID

---

#### `xano_publish_api`
Publish draft endpoint to production.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID
- `api_id` (number): API endpoint ID

## 3. Authentication & Security

#### `xano_set_security`
Set security for resources.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `resource_type` (string): "api", "table", "function", or "task"
- `resource_id` (number): Resource ID
- `guid` (string): Security GUID

**Example:**
```javascript
await xano_set_security({
  instance_name: "my-instance",
  workspace_id: 1,
  resource_type: "api",
  resource_id: 456,
  guid: "auth_users_only"
});
```

## 4. File Operations

#### `xano_list_files`
List uploaded files.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `page` (number, optional): Page number
- `per_page` (number, optional): Files per page

---

#### `xano_upload_file`
Upload a file to storage.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `file_name` (string): File name
- `file_content` (string): Base64 encoded content
- `folder` (string, optional): Target folder

**Example:**
```javascript
const file = await xano_upload_file({
  instance_name: "my-instance",
  workspace_id: 1,
  file_name: "logo.png",
  file_content: "data:image/png;base64,iVBORw0KGgoAAAA...",
  folder: "images"
});
```

---

#### `xano_delete_file`
Delete a file from storage.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `file_id` (number): File ID

---

#### `xano_get_file_info`
Get file metadata.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `file_id` (number, optional): File ID
- `path` (string, optional): File path

## 5. Task Management

#### `xano_list_tasks`
List background tasks.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `search` (string, optional): Search term
- `include_draft` (boolean, optional): Include drafts

---

#### `xano_create_task`
Create a background task.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `script` (string): XanoScript code
- `type` (string, optional): "xs" (default)

**Example:**
```javascript
const task = await xano_create_task({
  instance_name: "my-instance",
  workspace_id: 1,
  script: `
    task cleanup {
      description = "Daily cleanup"
      schedule = "0 2 * * *"
      
      stack {
        db.del "logs" {
          field_name = "created_at"
          field_value = {"$lt": "now"|add_days:-30}
        }
      }
    }
  `
});
```

---

#### `xano_get_task_details`
Get task details with logic.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `task_id` (number): Task ID
- `include_draft` (boolean, optional): Include draft version

---

#### `xano_update_task`
Update task configuration.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `task_id` (number): Task ID
- `script` (string): Updated XanoScript

---

#### `xano_delete_task`
Delete a background task.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `task_id` (number): Task ID

---

#### `xano_activate_task`
Enable or disable a task.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `task_id` (number): Task ID
- `active` (boolean): Enable/disable

---

#### `xano_publish_task`
Publish task from draft to production.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `task_id` (number): Task ID

## 6. Function Management

#### `xano_list_functions`
List custom functions.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `search` (string, optional): Search term
- `include_draft` (boolean, optional): Include drafts

---

#### `xano_create_function`
Create a custom function.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `script` (string): XanoScript function code

**Example:**
```javascript
const func = await xano_create_function({
  instance_name: "my-instance",
  workspace_id: 1,
  script: `
    function calculate_tax {
      input {
        decimal amount
        decimal rate
      }
      
      var $tax { value = $input.amount|multiply:$input.rate|divide:100 }
      
      response {
        value = $tax
      }
    }
  `
});
```

---

#### `xano_get_function_details`
Get function details with code.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `function_id` (number): Function ID

---

#### `xano_update_function`
Update function code.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `function_id` (number): Function ID
- `script` (string): Updated code

---

#### `xano_delete_function`
Delete a custom function.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `function_id` (number): Function ID

---

#### `xano_publish_function`
Publish function to production.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `function_id` (number): Function ID

## 7. High-Level Tools (SDK Powered)

These tools use the XanoScript SDK to generate complex functionality with minimal configuration.

### `middleware_deploy_sdk_code` ⭐
Deploy endpoints using JavaScript-like SDK syntax.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): Target API group
- `sdk_code` (string): SDK code

**SDK Example:**
```javascript
const endpoint = create('users/active', 'GET')
  .requiresAuth('users')
  .dbQuery('users', {
    filter: { status: 'active' },
    sort: { created_at: 'desc' },
    page: '$input.page',
    per_page: 20
  }, 'activeUsers')
  .response({
    users: '$activeUsers.items',
    total: '$activeUsers.total'
  });

return endpoint.build().script;
```

**Benefits:**
- 95% less code than raw XanoScript
- Automatic error correction
- IDE auto-completion support
- Familiar JavaScript syntax

---

### `middleware_update_sdk_code`
Update existing endpoint using SDK.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `api_group_id` (number): API group ID
- `api_id` (number): Endpoint ID
- `sdk_code` (string): Updated SDK code

---

### `xano_create_auth_system`
Create complete authentication system.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `user_table` (string): User table name
- `api_group_name` (string): API group for auth endpoints
- `require_email_verification` (boolean, optional)
- `session_duration` (number, optional): Token lifetime in seconds

**Creates:**
- `/auth/register` - User registration
- `/auth/login` - User login
- `/auth/logout` - Logout
- `/auth/me` - Get current user
- `/auth/verify-email` - Email verification
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset

**Example:**
```javascript
await xano_create_auth_system({
  instance_name: "my-instance",
  workspace_id: 1,
  user_table: "users",
  api_group_name: "Authentication",
  require_email_verification: true,
  session_duration: 86400 // 24 hours
});
```

---

### `xano_create_crud_system`
Generate complete CRUD API for tables.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `table` (string): Target table
- `api_group_name` (string, optional): API group name
- `auth` (boolean|object, optional): Authentication config
- `features` (object, optional): Feature flags

**Features Object:**
```javascript
{
  pagination: true,
  search: {
    enabled: true,
    fields: ['name', 'description']
  },
  filters: {
    enabled: true,
    fields: ['status', 'category']
  },
  sorting: {
    enabled: true,
    fields: ['created_at', 'name'],
    default: 'created_at:desc'
  },
  soft_delete: false,
  audit_trail: false
}
```

**Example:**
```javascript
await xano_create_crud_system({
  instance_name: "my-instance",
  workspace_id: 1,
  table: "products",
  api_group_name: "Product Management",
  auth: {
    endpoints: {
      list: false,    // Public
      get: false,     // Public
      create: true,   // Auth required
      update: true,   // Auth required
      delete: true    // Auth required
    }
  },
  features: {
    search: { enabled: true },
    filters: { enabled: true },
    pagination: true
  }
});
```

---

### `xano_create_stripe_system`
Create Stripe payment integration.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `webhook_type` (string): "checkout", "subscription", or "payment_intent"
- `payment_table` (string): Table for payment records
- `api_group_name` (string): API group name
- `users_table` (string, optional): For subscriptions
- `orders_table` (string, optional): For checkout

**Creates endpoints for:**
- Checkout session creation
- Webhook handling
- Subscription management
- Payment status checking

---

### `xano_discover_workspace`
Analyze workspace structure and suggest optimizations.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `options` (object, optional): Discovery options

**Returns:**
```json
{
  "tables": {
    "count": 15,
    "list": [...],
    "relationships": [...]
  },
  "api_groups": {
    "count": 3,
    "endpoints_total": 45
  },
  "suggestions": [
    {
      "type": "missing_index",
      "table": "orders",
      "field": "user_id",
      "impact": "high"
    }
  ]
}
```

---

### `xano_test_endpoint`
Test an endpoint with automatic authentication.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `endpoint_url` (string): Full endpoint URL
- `method` (string, optional): HTTP method
- `payload` (object, optional): Request body
- `test_credentials` (object, optional): Auth credentials

**Example:**
```javascript
const result = await xano_test_endpoint({
  instance_name: "my-instance",
  workspace_id: 1,
  endpoint_url: "https://x8ki-letg.xano.io/api:abc/users",
  method: "POST",
  payload: {
    name: "Test User",
    email: "test@example.com"
  },
  test_credentials: {
    email: "admin@example.com",
    password: "password123"
  }
});
```

---

### `xano_migrate_content`
Bulk data operations and migrations.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `operation` (string): Operation type
- Additional parameters based on operation

**Operations:**
- `copy` - Copy records between tables
- `move` - Move records (copy + delete)
- `transform` - Transform data during migration
- `bulk_create` - Create many records
- `bulk_update` - Update many records
- `bulk_delete` - Delete many records

**Example:**
```javascript
await xano_migrate_content({
  instance_name: "my-instance",
  workspace_id: 1,
  operation: "transform",
  source_table: "old_users",
  target_table: "users",
  transform_rules: {
    field_mappings: {
      "full_name": "name",
      "email_address": "email"
    },
    value_transformations: {
      "status": {
        "1": "active",
        "0": "inactive"
      }
    }
  }
});
```

## 8. Template Tools

Pre-built XanoScript patterns for common use cases.

### `stripe_sdk_create_checkout_system`
Complete Stripe checkout implementation.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `success_url` (string): Success redirect URL
- `cancel_url` (string): Cancel redirect URL
- `users_table` (string, optional): User table name
- `orders_table` (string, optional): Orders table name

**Creates:**
- Checkout session endpoint
- Webhook handler
- Order creation logic

---

### `stripe_sdk_create_subscription_system`
Stripe subscription management.

**Parameters:**
- `instance_name` (string): Xano instance name
- `workspace_id` (number): Workspace ID
- `users_table` (string): User table
- `subscriptions_table` (string): Subscriptions table
- `enable_activity_logging` (boolean, optional)

**Creates:**
- Create subscription endpoint
- Cancel subscription endpoint
- Update subscription endpoint
- Webhook handlers

---

### `gpt_image`
Generate images with DALL-E.

**Parameters:**
- `prompt` (string): Image description
- `size` (string, optional): "1024x1024", "1536x1024", or "1024x1536"
- `quality` (string, optional): "high" or "medium"
- `n` (number, optional): Number of images (1-10)

**Example:**
```javascript
const images = await gpt_image({
  prompt: "A futuristic city skyline at sunset",
  size: "1536x1024",
  quality: "high",
  n: 2
});
```

## 9. Utility Tools

### `xano_whoami`
Get current authentication status.

**Returns:**
```json
{
  "authenticated": true,
  "user": {
    "id": 123,
    "email": "user@example.com"
  },
  "instance": "my-instance"
}
```

---

### `xano_list_instances`
List all available Xano instances.

**Returns:**
```json
[
  {
    "name": "my-instance",
    "url": "https://x8ki-letg.xano.io",
    "workspaces": 3
  }
]
```

---

### `xano_get_instance_details`
Get instance configuration.

**Parameters:**
- `instance_name` (string): Instance name

---

### `xano_list_databases`
List workspaces in an instance.

**Parameters:**
- `instance_name` (string): Instance name

**Returns:**
```json
[
  {
    "id": 1,
    "name": "Production",
    "tables": 15,
    "apis": 45
  }
]
```

---

### `xano_get_started`
Show getting started guide.

**Returns:** Markdown guide with examples and tips.

---

### `xano_syntax_reference`
Get XanoScript syntax reference.

**Returns:** Complete syntax documentation with examples.

## Best Practices

### 1. Use High-Level Tools First
Start with `middleware_*` tools for complex operations:
- `xano_create_auth_system` for authentication
- `xano_create_crud_system` for CRUD APIs
- `middleware_deploy_sdk_code` for custom logic

### 2. Leverage the SDK
Write SDK code instead of raw XanoScript:
```javascript
// SDK (recommended)
.dbQuery('users', { filter: { active: true } }, 'users')

// vs XanoScript (avoid)
db.query "users" { search = `$db.users.active == true` } as $users
```

### 3. Test Before Production
Always test endpoints before deploying:
```javascript
// Test with sample data
await xano_test_endpoint({
  endpoint_url: "...",
  payload: { test: true }
});
```

### 4. Use Proper Field Types
Choose appropriate field types:
- `text` not `string`
- `bool` not `boolean`
- `int` not `integer`
- `decimal` not `float`

### 5. Index for Performance
Create indexes on frequently queried fields:
```javascript
await xano_manage_table_indexes({
  action: "create",
  fields: [{ name: "user_id" }, { name: "created_at" }],
  type: "btree"
});
```

## Common Patterns

### Authentication Flow
```javascript
// 1. Create auth system
await xano_create_auth_system({
  user_table: "users",
  api_group_name: "Auth"
});

// 2. Protect other endpoints
const endpoint = create('profile', 'GET')
  .requiresAuth('users')
  .response({ user: '$auth' });
```

### File Upload Handling
```javascript
const endpoint = create('upload-avatar', 'POST')
  .requiresAuth('users')
  .input('file', 'image', { maxSize: 5 })
  .createImage('$input.file', 'avatar-$auth.id', 'image')
  .dbEdit('users', 
    { id: '$auth.id' }, 
    { avatar_url: '$image.url' }
  )
  .response({ url: '$image.url' });
```

### Webhook Processing
```javascript
const endpoint = create('webhook', 'POST')
  .input('data', 'json')
  .var('event_type', '$headers.x-event-type')
  .conditional('$event_type == "payment.success"')
    .then(e => e
      .dbEdit('orders',
        { id: '$input.data.order_id' },
        { status: 'paid', paid_at: 'now' }
      )
    )
  .endConditional()
  .response({ received: true });
```

## Error Handling

Most tools return standardized error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'email' is required",
    "details": {
      "field": "email",
      "rule": "required"
    }
  }
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input
- `NOT_FOUND` - Resource doesn't exist
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `CONFLICT` - Duplicate or constraint violation
- `SERVER_ERROR` - Internal error

## Rate Limits

API calls are subject to rate limiting:
- **Standard**: 1000 requests/hour
- **Bulk operations**: 100 requests/hour
- **File uploads**: 500 MB/hour

Check response headers:
- `X-RateLimit-Limit`: Total allowed
- `X-RateLimit-Remaining`: Requests left
- `X-RateLimit-Reset`: Reset timestamp

## Support Resources

- **Documentation**: [docs.xano-mcp.com](https://docs.xano-mcp.com)
- **Community**: [discord.gg/xano-mcp](https://discord.gg/xano-mcp)
- **Examples**: [github.com/xano-mcp/examples](https://github.com/xano-mcp/examples)
- **Support**: support@xano-mcp.com

Happy building with Xano MCP! 🚀