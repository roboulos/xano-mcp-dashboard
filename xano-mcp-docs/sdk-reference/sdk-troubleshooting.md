# Xano MCP SDK Troubleshooting Guide

## Table of Contents
- [Common Error Messages](#common-error-messages)
- [Method-Specific Issues](#method-specific-issues)
- [Filter Problems](#filter-problems)
- [Deployment Failures](#deployment-failures)
- [Performance Issues](#performance-issues)
- [Debugging Techniques](#debugging-techniques)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## Common Error Messages

### "Type error detected"
**What it means**: The SDK method you're calling doesn't exist or has the wrong signature.

**Common causes**:
- Typo in method name (e.g., `dbupdate` instead of `dbEdit`)
- Wrong case (e.g., `foreach` instead of `forEach`)
- Method doesn't exist (e.g., `createToken` has issues)

**Solutions**:
```javascript
// ❌ Wrong
.dbupdate('users', { id: 1 }, { name: 'John' })
.foreach('$items', 'item')

// ✅ Correct
.dbEdit('users', { id: 1 }, { name: 'John' })
.forEach('$items', 'item')
```

### "SDK typecheck"
**What it means**: The parameters passed to a method are incorrect.

**Common causes**:
- Wrong parameter order
- Missing required parameters
- Incorrect parameter types

**Solutions**:
```javascript
// ❌ Wrong - filter should be an object
.dbGet('users', '$input.id', 'user')

// ✅ Correct
.dbGet('users', { id: '$input.id' }, 'user')

// ❌ Wrong - missing alias
.dbQuery('posts', { filters: { status: 'active' } })

// ✅ Correct
.dbQuery('posts', { filters: { status: 'active' } }, 'posts')
```

### "Learning & Improving"
**What it means**: The generated XanoScript has syntax errors or deployment failed.

**Common causes**:
- Invalid XanoScript syntax
- Authentication issues
- Permission problems
- API group doesn't exist

**Solutions**:
1. Check the `xanoscript_preview` in the response
2. Verify your authentication token
3. Ensure the API group exists
4. Check instance name is correct

### "is not a function"
**What it means**: You're calling a method that doesn't exist on the builder.

**Common causes**:
- Global functions used as methods
- Chaining on wrong object
- Missing endConditional() or endForEach()

**Solutions**:
```javascript
// ❌ Wrong - buildObject is global, not a method
.buildObject({ name: 'test' })

// ✅ Correct - use in value context
.var('obj', buildObject({ name: 'test' }))

// ❌ Wrong - forgot to close conditional
.conditional('$test')
  .then(e => e.var('x', 1))
.var('y', 2)  // Error - still in conditional context

// ✅ Correct
.conditional('$test')
  .then(e => e.var('x', 1))
.endConditional()
.var('y', 2)
```

## Method-Specific Issues

### Database Operations

#### dbQuery filters vs filter
**Problem**: Using singular 'filter' instead of plural 'filters'

```javascript
// ❌ FAILS - Common mistake
.dbQuery('posts', { 
  filter: { status: 'published' }  // Wrong!
}, 'posts')

// ✅ WORKS - Use 'filters' (plural)
.dbQuery('posts', { 
  filters: { status: 'published' }  // Correct!
}, 'posts')
```

#### dbGet single field limitation
**Problem**: dbGet only accepts one filter field

```javascript
// ❌ FAILS - Multiple fields
.dbGet('users', { 
  email: '$input.email',
  status: 'active'  // Won't work!
}, 'user')

// ✅ WORKS - Use dbQuery for multiple filters
.dbQuery('users', {
  filters: { 
    email: '$input.email',
    status: 'active'
  },
  limit: 1
}, 'users')
.var('user', '$users[0]')
```

#### Table name formatting
**Problem**: Extra quotes around table names

```javascript
// ❌ Wrong - Extra quotes
.dbQuery('"users"', {}, 'users')
.dbQuery("'users'", {}, 'users')

// ✅ Correct - SDK handles quoting
.dbQuery('users', {}, 'users')
.dbQuery('👤 users', {}, 'users')  // Emoji tables work!
```

### Authentication Issues

#### requiresAuth table reference
**Problem**: Wrong table name or format

```javascript
// ❌ Wrong
.requiresAuth('users')  // Missing emoji
.requiresAuth('"👤 users"')  // Extra quotes

// ✅ Correct
.requiresAuth('👤 users')
```

#### createToken problems
**Problem**: This method has unclear signature and often fails

```javascript
// ❌ Often fails
.createToken({ 
  dbtable: 'users',
  id: '$user.id'
}, 86400, 'token')

// ✅ Alternative approach - use manual token creation
.apiRequest('$env.XANO_API_URL/auth/token', 'POST', {
  body: buildObject({
    user_id: '$user.id',
    expires_in: 86400
  })
}, 'token_response')
```

### Control Flow

#### forEach case sensitivity
**Problem**: Using lowercase 'foreach'

```javascript
// ❌ FAILS - Wrong case
.foreach('$items', 'item')
  .var('processed', '$item.name')
.endforeach()

// ✅ WORKS - Correct case
.forEach('$items', 'item')
  .var('processed', '$item.name')
.endForEach()
```

#### Missing end statements
**Problem**: Forgetting to close control structures

```javascript
// ❌ FAILS - Unclosed conditional
.conditional('$test')
  .then(e => e.var('x', 1))
.response({ x: '$x' })  // Error!

// ✅ WORKS - Properly closed
.conditional('$test')
  .then(e => e.var('x', 1))
.endConditional()
.response({ x: '$x' })
```

### Response Building

#### Nested objects in response
**Problem**: Direct nested objects fail in XanoScript

```javascript
// ❌ FAILS (but auto-fixed)
.response({
  data: {
    user: { name: '$user.name' }
  }
})

// ✅ BEST PRACTICE - Build separately
.var('user_data', buildObject({ name: '$user.name' }))
.var('response_data', buildObject({ user: '$user_data' }))
.response({ data: '$response_data' })
```

## Filter Problems

### String Concatenation

#### Using add filter for strings
**Problem**: `add` is for numbers, not strings

```javascript
// ❌ WRONG - add is mathematical
.var('greeting', '"Hello "|add:$name')

// ✅ CORRECT - use concat
.var('greeting', '"Hello "|concat:$name')
```

### Array Operations

#### Using length instead of count
**Problem**: Arrays use `count`, not `length`

```javascript
// ❌ WRONG
.var('size', '$array|length')

// ✅ CORRECT
.var('size', '$array|count')
```

### Common Filter Mistakes

| Intent | Wrong Filter | Correct Filter |
|--------|--------------|----------------|
| String length | `\|length` | `\|strlen` |
| Array length | `\|length` | `\|count` |
| Multiply | `\|times:` | `\|multiply:` |
| String concat | `\|add:` | `\|concat:` |
| Date format | `\|date_format:` | `\|format:` |

### Filter That Don't Exist

These filters are commonly attempted but don't exist:
- `first_not_empty`
- `first_not_null`
- `coalesce`
- `default_if_null`
- `date_format` (use `format`)

## Deployment Failures

### Instance Name Issues

**Problem**: Using wrong instance name

```javascript
// ❌ WRONG - Old instance
{
  "instance_name": "xivz-202s-g8gq",
  "workspace_id": 1
}

// ✅ CORRECT - Current instance
{
  "instance_name": "xnwv-v1z6-dvnr",
  "workspace_id": 1
}
```

### API Group Not Found

**Problem**: API group doesn't exist

**Solution**:
1. First create the API group:
```javascript
// Check existing groups
GET /api/xano/browse-api-groups

// Create if needed
POST /api/xano/create-api-group
{
  "name": "My API Group",
  "description": "API endpoints"
}
```

2. Then deploy to the group:
```javascript
{
  "api_group_id": 123,  // Use the created group ID
  "sdk_code": "..."
}
```

### Authentication Failures

**Problem**: Invalid or expired token

**Symptoms**:
- 401 Unauthorized errors
- "Authentication required" messages

**Solution**:
1. Verify token in environment variables
2. Check token hasn't expired
3. Ensure token has correct permissions

## Performance Issues

### Large Dataset Processing

**Problem**: Timeout when processing many records

```javascript
// ❌ BAD - Processes all at once
.dbQuery('large_table', {}, 'all_records')
.forEach('$all_records', 'record')
  // Heavy processing
.endForEach()

// ✅ GOOD - Batch processing
.var('offset', 0)
.var('batch_size', 100)
.while('true')
  .dbQuery('large_table', {
    limit: '$batch_size',
    offset: '$offset'
  }, 'batch')
  
  .conditional('$batch|count == 0')
    .then(e => e.break())
  .endConditional()
  
  .forEach('$batch', 'record')
    // Process record
  .endForEach()
  
  .varUpdate('offset', '$offset + $batch_size')
  .utilSleep(0.1)  // Prevent timeout
.endWhile()
```

### Inefficient Filtering

**Problem**: Filtering after retrieval instead of in query

```javascript
// ❌ INEFFICIENT - Gets all then filters
.dbQuery('products', {}, 'all_products')
.var('active', '$all_products|filter:"$item.status == \\"active\\""')

// ✅ EFFICIENT - Filter at database level
.dbQuery('products', {
  filters: { status: 'active' }
}, 'active_products')
```

## Debugging Techniques

### 1. Check Generated XanoScript

Always review the `xanoscript_preview` in the response:

```javascript
// In the deployment response
{
  "success": true,
  "xanoscript_preview": "query test verb=GET\n...",
  "adaptations": ["Fixed string concatenation", "..."]
}
```

### 2. Test Incrementally

Build complex endpoints step by step:

```javascript
// Step 1: Basic structure
const endpoint = create('test', 'GET')
  .response({ message: 'Hello' });
// Deploy and test

// Step 2: Add input
endpoint.input('name', 'text', { required: true })
  .response({ message: '"Hello, "|concat:$input.name' });
// Deploy and test

// Step 3: Add database
endpoint.dbGet('users', { name: '$input.name' }, 'user')
  .response({ message: '"Hello, "|concat:$user.name' });
// Deploy and test
```

### 3. Use Logging

Add temporary logging to debug:

```javascript
.var('debug_input', '$input')
.log('Input received: |concat:$debug_input')

.dbQuery('users', { filters: {} }, 'users')
.log('Users found: |concat:$users|count')
```

### 4. Validate Filters

Test filter chains separately:

```javascript
// Test in a simple endpoint first
.var('test', '"hello world"')
.var('result', '$test|uppercase|replace:" ":"_"')
.response({ result: '$result' })
// Should output: { result: "HELLO_WORLD" }
```

## Best Practices

### 1. Always Return the Script
```javascript
// ❌ WRONG - No return
const endpoint = create('test', 'GET').response({ ok: true });

// ✅ CORRECT - Return the script
const endpoint = create('test', 'GET').response({ ok: true });
return endpoint.build().script;
```

### 2. Use Exact Method Names
```javascript
// Common mistakes to avoid:
// ❌ dbquery → ✅ dbQuery
// ❌ foreach → ✅ forEach
// ❌ BuildObject → ✅ buildObject
// ❌ endforeach → ✅ endForEach
```

### 3. Build Complex Objects Separately
```javascript
// Don't nest buildObject calls in response
// ✅ GOOD
.var('nested', buildObject({ field: 'value' }))
.var('response_data', buildObject({ data: '$nested' }))
.response({ result: '$response_data' })
```

### 4. Check Auto-Fix Summary
Review what was automatically fixed:
```javascript
// In deployment response
"adaptation_summary": {
  "total_adaptations": 3,
  "categories": {
    "filter_corrections": 2,
    "method_fixes": 1
  }
}
```

### 5. Use Correct Instance Name
Always use: `xnwv-v1z6-dvnr`

## FAQ

### Q: Why does my endpoint return "Type error detected"?
**A**: You're likely calling a method that doesn't exist. Check for typos and ensure correct case (forEach not foreach).

### Q: Can I use ternary operators?
**A**: Yes, despite some docs saying otherwise:
```javascript
.var('status', '$user.active ? "active" : "inactive"')
```

### Q: Why does dbGet only accept one filter?
**A**: It's designed for single-field lookups. Use dbQuery with limit:1 for multiple filters.

### Q: How do I debug deployment failures?
**A**: Check the xanoscript_preview in the response and look for syntax errors or invalid operations.

### Q: Why are my filters not working?
**A**: Ensure you're using the correct filter names (count not length for arrays) and proper syntax (|filter:param).

### Q: Can I import SDK functions?
**A**: No, create(), buildObject(), buildArray(), and filters are globally available. Don't import them.

### Q: How do I handle errors in my endpoint?
**A**: Use conditionals to check for errors and return early:
```javascript
.conditional('$error != null')
  .then(e => e
    .response({ error: '$error' })
    .stop()
  )
.endConditional()
```

### Q: What's the difference between var and varUpdate?
**A**: They're functionally the same. Both can create or update variables.

### Q: How do I know if deployment succeeded despite errors?
**A**: Check if an endpoint_id was returned. The tool often shows errors even when deployment succeeds.

### Q: Why does my complex object in response get extracted?
**A**: The SDK auto-fixes nested objects by extracting them to variables. This is normal and correct behavior.