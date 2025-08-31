# XanoScript Translation Architecture

## Overview

The XanoScript translation system transforms JavaScript SDK code into XanoScript through a sophisticated multi-layered pipeline. This document details the translation process, bulletproofing features, and optimization strategies that enable AI assistants to generate production-ready Xano endpoints with 82%+ deployment success rates.

## Translation Pipeline Architecture

### Layer Overview

```
┌─────────────────────┐
│   SDK JavaScript    │  Developer/AI writes fluent API code
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Pre-flight Validation│  Client-side validation (MCP)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Middleware API    │  HTTP POST to middleware service
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Auto-Fixer Layer  │  Corrects common mistakes
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  FluentBuilder Core │  Builds internal representation
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ XanoScript Generator│  Converts to XanoScript syntax
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Deployment Engine  │  Sends to Xano Meta API
└─────────────────────┘
```

## SDK to XanoScript Translation

### Core Translation Patterns

#### 1. Basic Method Mappings

```javascript
// SDK Method → XanoScript Output

create('endpoint-name', 'GET')
// → query endpoint-name verb=GET

.input('user_id', 'int', { required: true })
// → input int user_id

.var('timestamp', 'now')
// → var timestamp { value = now }

.response({ success: true, data: '$result' })
// → response { value = { success = true, data = $result } }
```

#### 2. Database Operations

```javascript
// Simple Query
.dbQuery('users', { filter: { active: true } }, 'users')
// → var users {
//     value = query users
//     search { active = true }
//   }

// Complex Query with Pagination
.dbQuery('posts', {
  filter: { status: 'published' },
  page: '$input.page',
  per_page: 20,
  sort: [{ field: 'created_at', order: 'desc' }]
}, 'posts')
// → var posts {
//     value = query posts
//     search { status = "published" }
//     pagination { page = $input.page, per_page = 20 }
//     sort { field = created_at, direction = desc }
//   }

// Single Record Get
.dbGet('users', { id: '$input.user_id' }, 'user')
// → var user {
//     value = get users
//     where { id = $input.user_id }
//   }

// Update Operation
.dbEdit('users', { id: '$auth.id' }, { last_login: 'now' }, 'updated')
// → var updated {
//     value = edit users
//     where { id = $auth.id }
//     data { last_login = now }
//   }
```

#### 3. Complex Object Building

```javascript
// Using buildObject() for nested structures
.var('response_data', buildObject({
  user: '$user',
  metadata: buildObject({
    timestamp: 'now',
    version: '1.0'
  }),
  tags: buildArray(['active', 'premium'])
}))

// Generates XanoScript filter chain:
// var response_data {
//   value = {}|set:"user":$user|set:"metadata":{}|set:"timestamp":now|set:"version":"1.0"|set:"tags":[]|push:"active"|push:"premium"
// }
```

### Filter Pipeline Syntax

XanoScript uses a pipeline syntax (`|`) for data transformations:

#### String Filters
```javascript
// SDK → XanoScript
'$text|to_upper|trim|replace:" ":"-"'
// Direct passthrough, generates same pipeline

// Common string filters (37 verified working):
// to_upper, to_lower, capitalize, trim, ltrim, rtrim, to_slug, to_ascii,
// escape_html, unescape_html, word_count, title_case, snake_case, camel_case,
// pascal_case, kebab_case, strlen, substr, replace, replace_all, split, contains,
// starts_with, ends_with, pad_left, pad_right, explode, implode, regex_replace,
// regex_extract, regex_extract_all, url_parse, url_addarg, url_delarg, url_setarg,
// escape, addslashes, nl2br, concat
```

#### Array Filters
```javascript
// SDK → XanoScript
'$items|count'  // NOT length!
'$items|filter:active|sort:name|first'

// Common array filters:
// count, first, last, sort, reverse, unique, flatten, chunk,
// slice, merge, intersect, diff, keys, values, pluck, groupBy, implode
```

#### Math Operations
```javascript
// SDK → XanoScript
'$price|multiply:1.08|round:2'
'$value|add:10|divide:2'

// Math filters:
// abs, round, ceil, floor, add, subtract, multiply, divide, pow, sqrt,
// min, max, number_format, toInt, toDecimal
```

## Bulletproofing Features

### Auto-Fix Mechanism

The middleware's auto-fix layer corrects common AI-generated mistakes:

#### 1. String Concatenation Fix
```javascript
// Before (common AI mistake)
.var('message', '"Hello "|add:$name')

// After (auto-fixed)
.var('message', '"Hello "|concat:$name')
```

#### 2. Variable Unquoting in Responses
```javascript
// Before (AI tends to quote variables)
.response({ message: "$greeting" })

// After (auto-fixed)
.response({ message: '$greeting' })  // No quotes around variable
```

#### 3. Database Field Normalization
```javascript
// Before (AI uses full path)
.precondition('$db.users.status == "active"')

// After (auto-fixed)
.precondition('status == "active"')
```

#### 4. Method Name Corrections
```javascript
// Common AI mistakes → Correct methods
dbUpdate → dbEdit
query → dbQuery
foreach → forEach
BuildObject → buildObject
```

#### 5. Filter Name Corrections
```javascript
// Wrong filter → Correct filter
|length → |count (for arrays)
|length → |strlen (for strings)
|times: → |multiply:
|date_format → |format
|add: → |concat: (for strings)
```

### Pre-flight Validation

The MCP tool performs client-side validation before sending to middleware:

```javascript
// Validation checks
- Presence of create() function
- Return statement with endpoint.build().script
- Correct dbQuery syntax (filter not filters)
- No nested objects in response()
- No ternary operators in variables
- No MongoDB operators ($gte, $ne, etc.)
```

### Error Classification System

Errors are classified and enhanced with targeted guidance:

```javascript
// Error types and suggestions
{
  lint: "Check SDK syntax and method names",
  typecheck: "Verify parameter types match SDK requirements",
  validation: "Ensure all required fields are provided",
  deployment: "Check API group exists and permissions",
  auth: "Verify authentication token is valid",
  refinement: "Review XanoScript output for syntax errors"
}
```

## Complex Pattern Handling

### 1. Nested Response Objects

```javascript
// Problem: Direct nested objects cause "fatal" errors
.response({ 
  data: { 
    items: items, 
    meta: { count: total } 
  } 
})

// Solution: Use variables with buildObject
.var('response_data', buildObject({
  data: buildObject({
    items: '$items',
    meta: buildObject({ 
      count: '$total' 
    })
  })
}))
.response('$response_data')
```

### 2. Conditional Logic

```javascript
// Problem: Ternary operators don't work
.var('msg', '$auth ? "Hi " + $auth.name : "Hi guest"')

// Solution: Use conditional blocks
.conditional('$auth != null')
  .then(e => e.var('msg', '"Hi "|concat:$auth.name'))
  .else(e => e.var('msg', '"Hi guest"'))
.endConditional()
```

### 3. External API Calls

```javascript
.apiRequest('https://api.stripe.com/v1/charges', 'POST', {
  headers: buildArray([
    '"Authorization: Bearer "|concat:$env.STRIPE_KEY'
  ]),
  body: {
    amount: '$input.amount',
    currency: 'usd',
    source: '$input.token'
  }
}, 'charge_result')

// Generates proper XanoScript with header array construction
```

## Performance Optimizations

### 1. Token Reduction

The SDK system achieves 99% token reduction through:

- **Pattern Reuse**: Common patterns stored as templates
- **Compact Syntax**: Fluent API minimizes boilerplate
- **Smart Defaults**: Sensible defaults reduce configuration
- **Response Preview**: Only first 200 chars returned to client

### 2. Compilation Caching

```javascript
// Middleware caches compilation results
const cacheKey = hash(sdkCode + instance + workspace);
if (compilationCache.has(cacheKey)) {
  return compilationCache.get(cacheKey);
}
```

### 3. Batch Processing

```javascript
// Multiple operations in single deployment
const operations = [
  create('list-users', 'GET')...,
  create('get-user', 'GET')...,
  create('create-user', 'POST')...,
  create('update-user', 'PUT')...,
  create('delete-user', 'DELETE')...
];

// Deployed in single middleware call
```

### 4. Filter Chain Optimization

```javascript
// Before optimization
{}|set:"a":1|set:"b":2|set:"c":3

// After optimization (combined operations)
{a:1,b:2,c:3}
```

## Translation Statistics

Based on production usage data:

- **65%** of AI code uses incorrect filter names (auto-fixed)
- **40%** forget the return statement (auto-fixed)
- **30%** try to import global functions (auto-fixed)
- **25%** use nested objects in responses (auto-fixed)
- **20%** use incorrect method names (auto-fixed)
- **82%+** successful deployment rate after auto-fixing

## Global Functions

The SDK provides global functions that don't require imports:

```javascript
// Available globally in SDK context
buildObject({ key: value, ... })  // Creates object with filter chain
buildArray(['item1', 'item2'])    // Creates array with push filters
```

## Future Enhancements

### Planned Improvements

1. **AST-Based Translation**
   - Parse SDK code into AST for more reliable transformation
   - Better error recovery and suggestions

2. **Type-Safe SDK**
   - Full TypeScript definitions
   - Compile-time validation

3. **Incremental Compilation**
   - Only recompile changed portions
   - Faster iteration cycles

4. **Visual Builder Integration**
   - Generate SDK code from visual flow
   - Bidirectional sync

5. **Real-time Validation**
   - IDE plugins for live error detection
   - Instant feedback during development