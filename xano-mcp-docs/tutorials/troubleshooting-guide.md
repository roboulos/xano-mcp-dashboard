# Xano MCP Troubleshooting Guide

This guide helps you resolve common issues when building with Xano MCP. We've organized solutions by category to help you quickly find answers.

## Quick Diagnostics

Before diving into specific issues, run these diagnostic checks:

```javascript
// 1. Check authentication
const auth = await xano_whoami();
console.log('Authenticated:', auth.authenticated);

// 2. Verify instance connection
const instances = await xano_list_instances();
console.log('Available instances:', instances);

// 3. Test workspace access
const databases = await xano_list_databases({
  instance_name: "your-instance"
});
console.log('Workspaces:', databases);
```

## Common Issues & Solutions

### Authentication Issues

#### "Not authenticated" Error
**Problem:** Getting authentication errors when calling MCP tools.

**Solution:**
1. Ensure you have a valid API key from your Xano instance
2. Check that the API key has proper permissions
3. Verify the instance name is correct

```javascript
// Correct instance name format
instance_name: "x8ki-letg-xxxx"  // Without .xano.io

// Or full domain
instance_name: "x8ki-letg-xxxx.n7.xano.io"
```

#### Token Expiration
**Problem:** Authentication works initially but fails after some time.

**Solution:**
- Xano tokens expire based on your settings
- Implement token refresh logic
- Check token expiry in auth settings:

```javascript
const authSettings = await xano_get_auth_settings();
console.log('Token expires in:', authSettings.token_expiry, 'seconds');
```

### Database Operations

#### Table Not Found
**Problem:** "Table not found" error when trying to access a table.

**Common Causes:**
1. Table name has special characters or emojis
2. Wrong workspace ID
3. Table was deleted

**Solution:**
```javascript
// List all tables to verify exact name
const tables = await xano_list_tables({
  instance_name: "my-instance",
  workspace_id: 1
});

// For tables with emojis, use exact name
table_name: "👤 users"  // Not just "users"
```

#### Field Type Errors
**Problem:** "Invalid field type" when adding fields to schema.

**Solution:** Use correct Xano field types:
```javascript
// ✅ Correct
field_type: "text"     // Not "string"
field_type: "bool"     // Not "boolean"
field_type: "int"      // Not "integer"
field_type: "decimal"  // Not "float" or "double"

// Complete list of valid types:
const validTypes = [
  "text", "int", "decimal", "bool", "timestamp",
  "date", "time", "email", "password", "enum",
  "file", "image", "object", "array", "json",
  "uuid", "vector", "geo_point", "geo_polygon"
];
```

#### Record Creation Failures
**Problem:** Can't create records, getting validation errors.

**Common Issues:**
1. Missing required fields
2. Invalid data types
3. Unique constraint violations

**Solution:**
```javascript
// Check table schema first
const schema = await xano_get_table_schema({
  instance_name: "my-instance",
  workspace_id: 1,
  table_id: 123
});

// Ensure all required fields are provided
const requiredFields = schema.fields
  .filter(f => f.required)
  .map(f => f.name);

// Create record with proper data
await xano_create_table_record({
  table_id: 123,
  record_data: {
    // Include all required fields
    ...requiredFields.reduce((obj, field) => ({
      ...obj,
      [field]: getDefaultValue(field)
    }), {})
  }
});
```

### API Development

#### XanoScript Syntax Errors
**Problem:** "Syntax error" when deploying endpoints.

**Common Mistakes:**
```javascript
// ❌ Wrong: Using expressions
var $result { value = $a + $b }

// ✅ Correct: Using filters
var $result { value = $a|add:$b }

// ❌ Wrong: String concatenation
var $message { value = "Hello " + $name }

// ✅ Correct: Using concat filter or ~
var $message { value = "Hello "|concat:$name }
var $message { value = "Hello " ~ $name }
```

#### SDK Code Not Deploying
**Problem:** SDK code fails to deploy with `middleware_deploy_sdk_code`.

**Common Issues:**
1. Missing `return endpoint.build().script;`
2. Incorrect method names
3. Invalid filter names

**Solution:**
```javascript
// Always end SDK code with:
return endpoint.build().script;

// Use correct method names:
.dbEdit()    // Not .dbUpdate()
.dbGet()     // Not .dbFind()
.dbQuery()   // Not .dbSearch()

// Use correct filter syntax:
'$text|to_lower'    // Not |lowercase
'$array|count'      // Not |length
'$text|concat:"x"'  // Not |add:"x"
```

#### Response Building Errors
**Problem:** "Invalid response structure" errors.

**Solution:** Responses must be flat objects. For nested data:
```javascript
// ❌ Wrong: Nested response
.response({
  data: {
    user: { name: 'John' }
  }
})

// ✅ Correct: Use variables
.var('userData', buildObject({
  user: buildObject({ name: 'John' })
}))
.response({ data: '$userData' })
```

### File Operations

#### File Upload Failures
**Problem:** Files won't upload or return errors.

**Common Issues:**
1. File too large
2. Invalid file format
3. Base64 encoding issues

**Solution:**
```javascript
// Ensure proper base64 encoding
const fileContent = await fileToBase64(file);

// Check file size (in MB)
const fileSizeMB = (fileContent.length * 0.75) / 1048576;
if (fileSizeMB > 10) {
  throw new Error('File too large (max 10MB)');
}

// Upload with correct format
await xano_upload_file({
  instance_name: "my-instance",
  workspace_id: 1,
  file_name: "image.jpg",
  file_content: fileContent, // Must be base64
  folder: "uploads"
});
```

#### Image Processing Errors
**Problem:** Image transformations failing.

**Solution:**
```javascript
// Use supported image formats
const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// Validate before processing
const endpoint = create('upload-image', 'POST')
  .input('image', 'image', {
    required: true,
    maxSize: 5, // MB
    allowedFormats: supportedFormats
  })
  .createImage('$input.image', {
    transformations: {
      thumbnail: { width: 150, height: 150 },
      display: { width: 800, quality: 85 }
    }
  }, 'processed');
```

### Performance Issues

#### Slow Query Performance
**Problem:** Database queries taking too long.

**Solution 1:** Add indexes
```javascript
// Create index on frequently queried fields
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

**Solution 2:** Optimize queries
```javascript
// Use specific field selection
.dbQuery('users', {
  filter: { active: true },
  output: ['id', 'name', 'email'], // Only needed fields
  limit: 100 // Add reasonable limits
}, 'users')
```

#### API Timeout Errors
**Problem:** Endpoints timing out on large operations.

**Solution:** Use pagination and batch processing:
```javascript
const endpoint = create('process-records', 'POST')
  .var('page', 1)
  .var('processed', 0)
  
  .while('$page <= 10') // Process max 10 pages
    .dbQuery('records', {
      filter: { processed: false },
      page: '$page',
      per_page: 100
    }, 'batch')
    
    .foreach('$batch.items', 'record')
      // Process each record
      .dbEdit('records',
        { id: '$record.id' },
        { processed: true }
      )
      .var('processed', '$processed|add:1')
    .endForeach()
    
    .var('page', '$page|add:1')
  .endWhile()
  
  .response({ processed: '$processed' });
```

### Integration Issues

#### Stripe Webhook Failures
**Problem:** Stripe webhooks not processing correctly.

**Solution:** Verify webhook signature
```javascript
const endpoint = create('stripe-webhook', 'POST')
  .input('data', 'json')
  
  // Verify signature
  .var('signature', '$headers.stripe-signature')
  .verifyStripeWebhook('$input.data', '$signature', '$env.STRIPE_WEBHOOK_SECRET', 'verified')
  
  .conditional('!$verified')
    .then(e => e.response({ error: 'Invalid signature' }, 401))
  .endConditional()
  
  // Process valid webhook
  .var('event', '$input.data')
  // ... handle event
```

#### External API Connection Issues
**Problem:** Can't connect to external APIs.

**Common Issues:**
1. Missing API keys
2. Incorrect headers
3. CORS issues

**Solution:**
```javascript
// Proper external API setup
.apiRequest({
  url: 'https://api.service.com/endpoint',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer $env.API_KEY',
    'Content-Type': 'application/json'
  },
  body: {
    data: '$input.data'
  },
  timeout: 30 // seconds
}, 'response')

// Handle errors
.conditional('$response.status != 200')
  .then(e => e
    .var('error', buildObject({
      status: '$response.status',
      message: '$response.body.error'
    }))
    .response({ error: '$error' }, 500)
  )
.endConditional()
```

### Environment & Configuration

#### Missing Environment Variables
**Problem:** `$env.VARIABLE_NAME` returns null.

**Solution:**
1. Set environment variables in Xano dashboard
2. Navigate to Settings → Environment Variables
3. Add required variables:

```javascript
// Common environment variables
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
SENDGRID_API_KEY
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

#### CORS Errors
**Problem:** Frontend getting CORS errors when calling APIs.

**Solution:** Configure CORS in API group settings:
```javascript
await xano_update_api_group({
  instance_name: "my-instance",
  workspace_id: 1,
  api_group_id: 123,
  cors: {
    enabled: true,
    origins: ["https://myapp.com", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type", "Authorization"]
  }
});
```

## Debugging Techniques

### 1. Enable Verbose Logging
Add logging throughout your endpoints:
```javascript
.var('debug_step1', '"Starting process"')
.log('$debug_step1')

.dbQuery('users', {}, 'users')
.var('debug_users', '$users|count ~ " users found"')
.log('$debug_users')
```

### 2. Use Test Endpoints
Create test versions of endpoints:
```javascript
const testEndpoint = create('test/debug', 'GET')
  .var('tables', await xano_list_tables())
  .var('auth', '$auth')
  .var('headers', '$headers')
  .response({
    tables: '$tables',
    auth: '$auth',
    headers: '$headers',
    timestamp: 'now'
  });
```

### 3. Check Xano Logs
Access logs programmatically:
```javascript
const logs = await xano_browse_logs({
  instance_name: "my-instance",
  workspace_id: 1,
  level: "error",
  limit: 50
});
```

### 4. Validate Before Deployment
Always validate SDK code:
```javascript
// Wrap deployment in try-catch
try {
  const result = await middleware_deploy_sdk_code({
    instance_name: "my-instance",
    workspace_id: 1,
    api_group_id: 123,
    sdk_code: endpointCode
  });
  console.log('Deployment successful:', result);
} catch (error) {
  console.error('Deployment failed:', error.message);
  // Check for specific error patterns
  if (error.message.includes('filter')) {
    console.log('Filter syntax error - check filter names');
  }
}
```

## Error Reference

### MCP Tool Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `TOOL_NOT_FOUND` | MCP tool doesn't exist | Check tool name spelling |
| `INVALID_PARAMS` | Missing or invalid parameters | Verify required parameters |
| `AUTH_REQUIRED` | Not authenticated | Provide valid API key |
| `RATE_LIMITED` | Too many requests | Wait and retry |

### XanoScript Errors

| Error | Description | Solution |
|-------|-------------|----------|
| `Unexpected token` | Syntax error in script | Check brackets and quotes |
| `Unknown filter` | Filter doesn't exist | Use correct filter name |
| `Variable not found` | Undefined variable | Define variable before use |
| `Type mismatch` | Wrong data type | Convert types with filters |

### Database Errors

| Error | Description | Solution |
|-------|-------------|----------|
| `Duplicate key` | Unique constraint violation | Check for existing records |
| `Foreign key constraint` | Invalid reference | Ensure referenced record exists |
| `Not null constraint` | Required field missing | Provide all required fields |
| `Check constraint` | Validation failed | Meet field validation rules |

## Best Practices for Error Prevention

### 1. Always Validate Input
```javascript
.precondition('$input.email|contains:"@"', 'Invalid email format')
.precondition('$input.age >= 18', 'Must be 18 or older')
.precondition('$input.amount > 0', 'Amount must be positive')
```

### 2. Handle Edge Cases
```javascript
// Check for null/empty
.conditional('$user == null')
  .then(e => e.response({ error: 'User not found' }, 404))
.endConditional()

// Handle empty arrays
.conditional('$results.items|count == 0')
  .then(e => e.response({ message: 'No results found', items: [] }))
.endConditional()
```

### 3. Use Transactions (When Available)
```javascript
// Group related operations
.group()
  .dbAdd('orders', orderData, 'order')
  .dbEdit('inventory', 
    { product_id: '$input.product_id' },
    { quantity: '$current_quantity|subtract:$input.quantity' }
  )
  .dbAdd('order_items', itemData)
.endGroup()
```

### 4. Implement Retry Logic
```javascript
// For external APIs
.var('retries', 0)
.var('success', false)

.while('$retries < 3 && !$success')
  .tryApiCall('https://api.example.com', 'result')
  .conditional('$result.status == 200')
    .then(e => e.var('success', true))
  .else(e => e
    .var('retries', '$retries|add:1')
    .wait(1000) // Wait 1 second before retry
  )
  .endConditional()
.endWhile()
```

## Getting Help

### Self-Service Resources
1. **Check Syntax Reference**: `await xano_syntax_reference()`
2. **Review Examples**: Look at generated template code
3. **Test in Isolation**: Create minimal test cases

### Community Support
- **Discord**: [discord.gg/xano-mcp](https://discord.gg/xano-mcp)
- **Stack Overflow**: Tag questions with `xano-mcp`
- **GitHub Issues**: Report bugs and request features

### Professional Support
- **Email**: support@xano-mcp.com
- **Priority Support**: Available with Pro plans
- **Consulting**: Custom development assistance

## Quick Fixes Checklist

When something isn't working, check these first:

- [ ] Correct instance name format
- [ ] Valid workspace ID
- [ ] Proper field types (text not string, bool not boolean)
- [ ] Table names with special characters quoted correctly
- [ ] SDK code ends with `return endpoint.build().script;`
- [ ] Using filters not expressions for calculations
- [ ] Response objects are flat (no deep nesting)
- [ ] Environment variables are set
- [ ] API key has necessary permissions
- [ ] Within rate limits

Remember: Most issues have simple solutions. Start with the basics before diving deep!