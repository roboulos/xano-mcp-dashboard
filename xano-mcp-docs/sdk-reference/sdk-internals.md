# Xano MCP SDK Internals

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Translation Pipeline](#translation-pipeline)
- [Auto-Fixing Mechanism](#auto-fixing-mechanism)
- [XanoScript Generation](#xanoscript-generation)
- [Deployment Process](#deployment-process)
- [Error Handling Layers](#error-handling-layers)
- [Performance Considerations](#performance-considerations)

## Architecture Overview

The Xano MCP SDK is built on a multi-layered architecture that transforms JavaScript method calls into XanoScript:

```
┌─────────────────────┐
│   SDK JavaScript    │  Developer writes fluent API code
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Auto-Fixer Layer  │  Corrects common mistakes
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Validation Layer   │  Ensures code meets requirements
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
│  Deployment Engine  │  Sends to Xano API
└─────────────────────┘
```

### Core Components

#### 1. FluentBuilder Class
The heart of the SDK, implemented in TypeScript:

```javascript
class FluentBuilder {
  constructor(name, method) {
    this.endpoint = {
      name: name,
      method: method,
      inputs: [],
      logic: [],
      response: null
    };
  }
  
  // Each method modifies internal state and returns this
  input(name, type, options) {
    this.endpoint.inputs.push({ name, type, ...options });
    return this;
  }
  
  var(name, value) {
    this.endpoint.logic.push({
      type: 'variable',
      name: name,
      value: this.processValue(value)
    });
    return this;
  }
  
  build() {
    return {
      script: this.generateXanoScript()
    };
  }
}
```

#### 2. Value Processing
The SDK intelligently processes values based on their type:

```javascript
processValue(value) {
  // Variables (start with $)
  if (typeof value === 'string' && value.startsWith('$')) {
    return value; // Keep as-is for XanoScript
  }
  
  // Special values
  if (value === 'now') return 'now';
  if (value === 'uuid') return 'uuid';
  if (value === 'null') return '"null"';
  
  // Regular strings
  if (typeof value === 'string') {
    return `"${value}"`; // Add quotes for XanoScript
  }
  
  // Numbers and booleans
  return value;
}
```

## Translation Pipeline

### Method-to-XanoScript Mapping

Each SDK method maps to specific XanoScript constructs:

#### Basic Mapping Examples

```javascript
// SDK Method → XanoScript Block

create('endpoint', 'GET')
// → query endpoint verb=GET

.input('name', 'text', { required: true })
// → input text name

.var('greeting', '"Hello"')
// → var greeting { value = "Hello" }

.dbQuery('users', { filters: { active: true } }, 'users')
// → var users {
//     value = query users
//     search { active = true }
//   }

.response({ message: '$greeting' })
// → response { value = { message = $greeting } }
```

#### Complex Translations

##### Object Building
```javascript
// SDK
buildObject({
  name: '$input.name',
  status: 'active',
  metadata: buildObject({
    created: 'now'
  })
})

// XanoScript Filter Chain
{}|set:"name":$input.name|set:"status":"active"|set:"metadata":{}|set:"created":now
```

##### Array Building
```javascript
// SDK
buildArray(['item1', '$variable', 'item3'])

// XanoScript Filter Chain
[]|push:"item1"|push:$variable|push:"item3"
```

##### Conditional Logic
```javascript
// SDK
.conditional('$user.role == "admin"')
  .then(e => e.var('access', 'full'))
  .else(e => e.var('access', 'limited'))
.endConditional()

// XanoScript
if ($user.role == "admin") {
  var access { value = "full" }
} else {
  var access { value = "limited" }
}
```

### Filter Pipeline Generation

The SDK generates filter pipelines for data transformation:

```javascript
// String filters
'$text|lowercase|trim|replace:" ":"-"'
// Generates: $text|lowercase|trim|replace:" ":"-"

// Array filters
'$items|filter:"$item.active == true"|map:"$item.name"|sort'
// Generates complex filter chain

// Math operations
'$price * 1.08'
// Converts to: $price|multiply:1.08
```

## Auto-Fixing Mechanism

The `autoFixSDKCode` function in `script-deploy.js` performs extensive corrections:

### 1. Import Statement Removal
```javascript
// Before
const { create, buildObject } = require('xano-sdk');

// After (auto-fixed)
// (imports removed - functions are global)
```

### 2. Method Name Corrections
```javascript
// Common mistakes → Correct methods
dbUpdate → dbEdit
query → dbQuery
foreach → forEach
BuildObject → buildObject
```

### 3. Filter Name Corrections
```javascript
// Wrong filter → Correct filter
|length → |count (for arrays)
|length → |strlen (for strings)
|times: → |multiply:
|date_format → |format
|add: → |concat: (for strings)
```

### 4. Response Object Extraction
```javascript
// Before
.response({
  data: buildObject({ nested: 'value' })
})

// After (auto-fixed)
.var('_response_data', buildObject({ nested: 'value' }))
.response({ data: '$_response_data' })
```

### 5. Missing Return Statement
```javascript
// Before
const endpoint = create('test', 'GET').response({ ok: true });

// After (auto-fixed)
const endpoint = create('test', 'GET').response({ ok: true });
return endpoint.build().script;
```

### Auto-Fix Statistics
Based on production data:
- 60-65% of AI-generated code uses wrong filter names
- 40% forget the return statement
- 30% try to import global functions
- 25% use nested objects in responses
- 20% use incorrect method names

## XanoScript Generation

### Generation Process

1. **Header Generation**
```javascript
generateHeader() {
  return `query ${this.endpoint.name} verb=${this.endpoint.method}`;
}
```

2. **Input Block Generation**
```javascript
generateInputs() {
  return this.endpoint.inputs.map(input => {
    const optional = input.required ? '' : '?';
    return `input ${input.type} ${input.name}${optional}`;
  }).join('\n');
}
```

3. **Logic Block Generation**
```javascript
generateLogic() {
  return this.endpoint.logic.map(item => {
    switch (item.type) {
      case 'variable':
        return `var ${item.name} { value = ${item.value} }`;
      case 'database':
        return this.generateDatabaseBlock(item);
      case 'conditional':
        return this.generateConditionalBlock(item);
      // ... other types
    }
  }).join('\n');
}
```

4. **Response Generation**
```javascript
generateResponse() {
  return `response { value = ${this.processResponseValue()} }`;
}
```

### Special Handling

#### Database Operations
```javascript
// dbQuery with complex options
.dbQuery('table', {
  filters: { status: 'active' },
  pagination: { page: 1, per_page: 20 },
  sort: { field: 'created_at', direction: 'desc' }
}, 'results')

// Generates:
var results {
  value = query table
  search { status = "active" }
  pagination { page = 1, per_page = 20 }
  sort { field = created_at, direction = desc }
}
```

#### External API Calls
```javascript
// apiRequest with headers
.apiRequest('https://api.example.com', 'POST', {
  headers: buildArray(['Authorization: Bearer $token']),
  body: { data: 'value' }
}, 'response')

// Generates:
var response {
  value = api_request("https://api.example.com", "POST")
  headers = []|push:"Authorization: Bearer "|concat:$token
  body = { data = "value" }
}
```

## Deployment Process

### Deployment Flow

1. **Request Reception**
```javascript
app.post('/deploy-script', async (req, res) => {
  const { instance_name, workspace_id, api_group_id, sdk_code } = req.body;
  // ...
});
```

2. **SDK Code Execution**
```javascript
async function executeSDKCode(sdkCode) {
  // Auto-fix common issues
  const { fixedCode, fixes } = autoFixSDKCode(sdkCode);
  
  // Validate
  const validation = validateSDKCode(fixedCode);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Execute in sandboxed context
  const context = createSDKContext();
  const script = vm.runInContext(fixedCode, context);
  
  return { script, fixes };
}
```

3. **Xano API Deployment**
```javascript
async function deployXanoScript(script, config) {
  const xano = new XanoClient(config);
  
  // Ensure API group exists
  await xano.ensureApiGroup(config.api_group_id);
  
  // Deploy endpoint
  const result = await xano.ensureApiEndpoint({
    apiGroupId: config.api_group_id,
    name: extractEndpointName(script),
    method: extractMethod(script),
    script: script,
    updateMode: 'recreate'
  });
  
  return result;
}
```

### Deployment Options

#### Create New Endpoint
```javascript
{
  updateMode: 'recreate',  // Replace if exists
  endpoint_config: {
    rate_limit: { requests: 100, window: 60 },
    auth_required: true
  }
}
```

#### Update Existing Endpoint
```javascript
{
  api_id: 12345,
  updateMode: 'update',
  preserve_settings: true  // Keep rate limits, etc.
}
```

## Error Handling Layers

### 1. Pre-Deployment Validation
```javascript
// Catches syntax errors before execution
function validateSDKCode(code) {
  // Check for create() call
  if (!code.includes('create(')) {
    return { valid: false, error: 'Missing create() call' };
  }
  
  // Check for return statement
  if (!code.includes('return') || !code.includes('.build().script')) {
    return { valid: false, error: 'Missing return statement' };
  }
  
  // Check for common typos
  const typos = findCommonTypos(code);
  if (typos.length > 0) {
    return { valid: false, error: `Found typos: ${typos.join(', ')}` };
  }
  
  return { valid: true };
}
```

### 2. Runtime Error Enhancement
```javascript
// Provides helpful error messages
try {
  result = await executeSDKCode(sdkCode);
} catch (error) {
  // Enhance "is not a function" errors
  if (error.message.includes('is not a function')) {
    const method = extractMethodName(error.message);
    const suggestion = getSuggestion(method);
    
    throw new Error(
      `${error.message}\n` +
      `Did you mean: ${suggestion}?\n` +
      `Check the SDK documentation for correct method names.`
    );
  }
  throw error;
}
```

### 3. Deployment Error Handling
```javascript
// Handles Xano API errors
try {
  deployed = await deployXanoScript(script, config);
} catch (xanoError) {
  // Extract meaningful error from Xano response
  const details = extractXanoErrorDetails(xanoError);
  
  return {
    error: 'DEPLOYMENT_FAILED',
    message: details.message,
    line: details.line,
    suggestion: getXanoErrorSuggestion(details)
  };
}
```

### Error Message Translation

The SDK translates cryptic errors into helpful messages:

| MCP Tool Message | Actual Meaning | Common Cause |
|------------------|----------------|--------------|
| "Type error detected" | Method doesn't exist | Typo in method name |
| "SDK typecheck" | Wrong method signature | Incorrect parameters |
| "Learning & Improving" | XanoScript syntax error | Invalid filter or syntax |
| "Deployment failed" | Xano API rejected script | Authentication or permissions |

## Performance Considerations

### 1. Auto-Fix Caching
```javascript
// Cache common fixes to avoid reprocessing
const fixCache = new Map();

function autoFixSDKCode(code) {
  const cacheKey = hash(code);
  if (fixCache.has(cacheKey)) {
    return fixCache.get(cacheKey);
  }
  
  const result = performAutoFixes(code);
  fixCache.set(cacheKey, result);
  return result;
}
```

### 2. Parallel Validation
```javascript
// Run multiple validations concurrently
async function validateComprehensive(code) {
  const [syntax, filters, methods] = await Promise.all([
    validateSyntax(code),
    validateFilters(code),
    validateMethods(code)
  ]);
  
  return { syntax, filters, methods };
}
```

### 3. XanoScript Optimization
```javascript
// Optimize generated XanoScript
function optimizeScript(script) {
  // Combine sequential set operations
  script = combineSetOperations(script);
  
  // Simplify filter chains
  script = simplifyFilters(script);
  
  // Remove redundant operations
  script = removeRedundancy(script);
  
  return script;
}
```

### Performance Metrics

Based on production usage:
- Average SDK code execution: 15-30ms
- Auto-fix processing: 5-10ms
- XanoScript generation: 10-20ms
- Xano API deployment: 200-500ms
- Total end-to-end: 250-600ms

### Optimization Tips

1. **Reuse Variables**: Don't recreate the same calculations
2. **Batch Operations**: Use single `dbQuery` instead of multiple `dbGet`
3. **Filter Early**: Apply filters at query time, not after retrieval
4. **Cache Patterns**: Store commonly used patterns for reuse
5. **Minimize API Calls**: Combine related operations

## Debugging Internals

### Enable Debug Mode
```javascript
// In SDK code
const endpoint = create('test', 'GET', { debug: true })
  .var('test', 'value')
  .response({ data: '$test' });

// Generates additional logging in XanoScript
```

### Inspect Generated Script
```javascript
// Always check the preview
const result = endpoint.build();
console.log(result.script); // Review before deployment
```

### Common Debug Points

1. **Check Auto-Fixes Applied**
   - Review `adaptation_summary` in response
   - Look for unexpected transformations

2. **Validate Filter Chains**
   - Ensure filters exist in XanoScript
   - Check parameter formatting

3. **Verify Variable References**
   - Confirm $ prefixes are preserved
   - Check variable scope in loops

4. **Test Incrementally**
   - Build complex endpoints step by step
   - Deploy and test each addition

## Future Architecture Plans

### Planned Improvements

1. **TypeScript Types**
   - Full type definitions for all methods
   - Compile-time validation

2. **AST-Based Generation**
   - Parse SDK code into AST
   - More reliable transformation

3. **Plugin System**
   - Custom method extensions
   - Third-party integrations

4. **Caching Layer**
   - Cache generated XanoScript
   - Faster repeated deployments

5. **Real-Time Validation**
   - IDE integration
   - Live error detection