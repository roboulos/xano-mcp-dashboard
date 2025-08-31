# Xano MCP SDK Overview

## What is the Xano MCP SDK?

The Xano MCP SDK is a JavaScript-based Domain-Specific Language (DSL) that allows developers to write API endpoints using familiar JavaScript syntax, which then translates to XanoScript - Xano's native scripting language. It provides a fluent interface for building complex API logic with method chaining, automatic error correction, and built-in best practices.

## Key Features

### 1. **Fluent Builder Pattern**
Write clean, chainable code that reads like natural language:
```javascript
const endpoint = create('get-user-profile', 'GET')
  .requiresAuth('👤 users')
  .input('id', 'int', { required: true })
  .dbGet('users', { id: '$input.id' }, 'user')
  .response({ data: '$user' });

return endpoint.build().script;
```

### 2. **Automatic Bulletproofing**
The SDK includes extensive auto-correction features that fix common mistakes:
- Corrects filter names (`|length` → `|strlen`)
- Fixes method names (`dbUpdate` → `dbEdit`)
- Handles string concatenation (`|add:` → `|concat:`)
- Normalizes table names (removes extra quotes)
- Converts nested response objects to proper variable declarations

### 3. **Type Safety & Validation**
While not statically typed, the SDK provides runtime validation:
- Validates filter existence before deployment
- Ensures correct method signatures
- Auto-converts value types for XanoScript compatibility
- Prevents deployment of invalid XanoScript

### 4. **Comprehensive Method Library**
Access to all core Xano functionality:
- Database operations (CRUD + advanced queries)
- Authentication & authorization
- External API integration
- File storage operations
- Redis caching (limited)
- Control flow (conditionals, loops)
- Data transformation (filters)

## How It Works

### Translation Process
1. **Write SDK Code**: Use JavaScript with the SDK's fluent API
2. **Auto-Fix Phase**: Common mistakes are automatically corrected
3. **Validation**: Code is validated for required patterns
4. **XanoScript Generation**: SDK methods translate to XanoScript blocks
5. **Deployment**: Generated script is deployed to Xano via API

### Example Translation
**SDK Code:**
```javascript
.var('greeting', '"Hello, "|concat:$input.name')
.var('response_data', buildObject({
  message: '$greeting',
  timestamp: 'now'
}))
```

**Generated XanoScript:**
```xanoscript
var greeting {
  value = "Hello, "|concat:$input.name
}
var response_data {
  value = {}|set:"message":$greeting|set:"timestamp":now
}
```

## Success Metrics

Based on extensive testing of 200+ patterns:
- **Core Operations**: 95%+ success rate
- **Common Patterns**: 95%+ success rate
- **Advanced Patterns**: 76.4% success rate
- **Overall Reliability**: Suitable for production use with proper testing

## When to Use the SDK

### Perfect For:
- Building RESTful APIs
- CRUD operations with authentication
- Integration with external services
- Data transformation and validation
- Webhook handling
- Scheduled tasks

### Not Ideal For:
- Complex transactions (limited support)
- Real-time features (WebSocket operations)
- Advanced Redis operations
- MongoDB-style queries

## Getting Started

### Prerequisites
- Xano account with API access
- Node.js environment (for local development)
- Basic understanding of JavaScript
- Familiarity with RESTful API concepts

### Basic Structure
Every SDK endpoint follows this pattern:
```javascript
// 1. Create the endpoint
const endpoint = create('endpoint-name', 'HTTP_METHOD')
  
// 2. Configure (inputs, auth, logic)
  .input('param', 'type', { options })
  .requiresAuth('table_name')
  .var('variable', 'value')
  
// 3. Perform operations
  .dbQuery('table', { filters }, 'alias')
  
// 4. Return response
  .response({ data: '$result' });

// 5. Build and export
return endpoint.build().script;
```

## Key Concepts

### 1. **Global Functions**
These functions are globally available (no import needed):
- `create()` - Start building an endpoint
- `buildObject()` - Create dynamic objects
- `buildArray()` - Create dynamic arrays
- `filters` - Access to filter methods

### 2. **Variable References**
- Use `$` prefix for variables: `$input.name`, `$user.id`
- Special values: `'now'` (timestamp), `'uuid'` (generate UUID)
- String literals need quotes: `'"active"'` not `'active'`

### 3. **Filter Pipelines**
XanoScript uses pipeline syntax for transformations:
```javascript
// SDK
.var('slug', '$input.title|lowercase|replace:" ":"-"')

// Generated XanoScript
var slug { value = $input.title|lowercase|replace:" ":"-" }
```

### 4. **Response Building**
Responses must be flat objects. For nested data:
```javascript
// ❌ This will be auto-fixed
.response({ 
  data: { nested: 'object' }
})

// ✅ Correct approach
.var('response_data', buildObject({ nested: 'object' }))
.response({ data: '$response_data' })
```

## Architecture

### Components
1. **FluentBuilder**: Core class implementing method chaining
2. **Auto-Fixer**: Pre-processes SDK code to correct common mistakes
3. **Validator**: Ensures code meets requirements
4. **Translator**: Converts SDK methods to XanoScript
5. **Deployment Engine**: Sends generated script to Xano

### Error Handling
The SDK provides multiple layers of error handling:
1. **Pre-deployment**: Syntax validation and auto-fixing
2. **Translation**: Method signature validation
3. **Deployment**: Xano API error handling
4. **Runtime**: Built-in patterns for error responses

## Next Steps

- [API Reference](./sdk-api-reference.md) - Complete method documentation
- [Common Patterns](./sdk-patterns.md) - Best practices and examples
- [Internals](./sdk-internals.md) - How translation works
- [Troubleshooting](./sdk-troubleshooting.md) - Common issues and solutions

## Important Notes

1. **Always return the script**: End with `return endpoint.build().script;`
2. **Check the preview**: Review generated XanoScript before deployment
3. **Test incrementally**: Build complex endpoints step by step
4. **Trust the auto-fixer**: Many common mistakes are corrected automatically
5. **Use exact syntax**: XanoScript is case-sensitive and precise