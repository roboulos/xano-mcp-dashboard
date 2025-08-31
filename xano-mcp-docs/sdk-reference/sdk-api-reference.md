# Xano MCP SDK API Reference

## Table of Contents
- [Core Methods](#core-methods)
- [Database Operations](#database-operations)
- [Authentication](#authentication)
- [Variables & Control Flow](#variables--control-flow)
- [External APIs](#external-apis)
- [Storage Operations](#storage-operations)
- [Redis Operations](#redis-operations)
- [Utility Functions](#utility-functions)
- [Global Functions](#global-functions)
- [Filter Reference](#filter-reference)

## Core Methods

### `create(name, method)`
Creates a new endpoint builder instance.

**Parameters:**
- `name` (string): Endpoint name/path (e.g., 'get-users', 'users/:id')
- `method` (string): HTTP method ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')

**Returns:** FluentBuilder instance

**Example:**
```javascript
const endpoint = create('list-products', 'GET')
```

### `.input(name, type, options)`
Defines an input parameter for the endpoint.

**Parameters:**
- `name` (string): Parameter name
- `type` (string): Data type
  - Basic: `'text'`, `'int'`, `'decimal'`, `'bool'`, `'timestamp'`
  - Complex: `'email'`, `'password'`, `'object'`, `'json'`, `'file'`, `'image'`
  - Special: `'enum'`, `'array'` (Note: 'array' often auto-fixed to 'object')
- `options` (object): Configuration
  - `required` (boolean): Whether input is required
  - `defaultValue` (any): Default value if not provided
  - `validators` (object): Type-specific validation rules

**Example:**
```javascript
.input('email', 'email', { required: true })
.input('status', 'enum', { 
  required: false,
  defaultValue: 'active',
  validators: { values: ['active', 'inactive', 'pending'] }
})
.input('page', 'int', { defaultValue: 1 })
```

### `.description(text)`
Sets the endpoint description.

**Parameters:**
- `text` (string): Description text

**Example:**
```javascript
.description('Retrieves a paginated list of active users')
```

### `.response(data, statusCode)`
Defines the endpoint response.

**Parameters:**
- `data` (object): Response data (must be flat object or variable reference)
- `statusCode` (number): HTTP status code (optional, rarely used)

**Example:**
```javascript
// Simple response
.response({ message: 'Success', data: '$result' })

// With nested data (requires variable)
.var('response_data', buildObject({
  user: '$user',
  meta: buildObject({ timestamp: 'now' })
}))
.response({ data: '$response_data' })
```

### `.build()`
Builds the endpoint and returns the result object.

**Returns:** Object with `script` property containing generated XanoScript

**Example:**
```javascript
return endpoint.build().script;
```

## Database Operations

### `.dbQuery(table, options, alias)`
Queries multiple records from a table.

**Parameters:**
- `table` (string): Table name
- `options` (object): Query configuration
  - `filters` (object): Field filters (NOTE: plural 'filters', not 'filter')
  - `pagination` (object): `{ page, per_page }`
  - `sort` (object): `{ field, direction }`
  - `search` (object): Field search conditions
  - `limit` (number): Maximum records
  - `offset` (number): Skip records
  - `output` (array): Fields to return
  - `with` (array): Related tables to include
- `alias` (string): Variable name for results

**Example:**
```javascript
.dbQuery('posts', {
  filters: { status: 'published', author_id: '$auth.id' },
  pagination: { page: '$input.page', per_page: 20 },
  sort: { field: 'created_at', direction: 'desc' }
}, 'posts')
```

### `.dbGet(table, filter, alias)`
Gets a single record by filter.

**Parameters:**
- `table` (string): Table name
- `filter` (object): Single field filter (one key-value pair only)
- `alias` (string): Variable name for result

**Example:**
```javascript
.dbGet('users', { id: '$input.user_id' }, 'user')
```

### `.dbAdd(table, data, alias)`
Creates a new record.

**Parameters:**
- `table` (string): Table name
- `data` (object): Record data
- `alias` (string): Variable name for created record

**Example:**
```javascript
.dbAdd('posts', {
  title: '$input.title',
  content: '$input.content',
  author_id: '$auth.id',
  created_at: 'now'
}, 'new_post')
```

### `.dbEdit(table, filter, data, alias)`
Updates existing record(s).

**Parameters:**
- `table` (string): Table name
- `filter` (object): Record filter
- `data` (object): Update data
- `alias` (string): Variable name for updated record

**Example:**
```javascript
.dbEdit('posts', 
  { id: '$input.id' },
  { 
    title: '$input.title',
    updated_at: 'now'
  },
  'updated_post')
```

### `.dbDelete(table, filter, alias)`
Deletes record(s).

**Parameters:**
- `table` (string): Table name
- `filter` (object): Record filter
- `alias` (string): Variable name for deletion result

**Example:**
```javascript
.dbDelete('posts', { id: '$input.id' }, 'deleted')
```

### `.dbCount(table, filter, alias)`
Counts records matching filter.

**Parameters:**
- `table` (string): Table name
- `filter` (object): Record filter
- `alias` (string): Variable name for count

**Example:**
```javascript
.dbCount('posts', { status: 'published' }, 'post_count')
```

### `.dbQueryCount(table, search, alias)`
Counts records with search conditions.

**Parameters:**
- `table` (string): Table name
- `search` (object): Search conditions
- `alias` (string): Variable name for count

**Example:**
```javascript
.dbQueryCount('users', { status: 'active' }, 'active_users')
```

### `.dbQuerySum(table, field, filter, alias)`
Sums a numeric field.

**Parameters:**
- `table` (string): Table name
- `field` (string): Field to sum
- `filter` (object): Record filter
- `alias` (string): Variable name for sum

**Example:**
```javascript
.dbQuerySum('orders', 'total_amount', { status: 'completed' }, 'revenue')
```

## Authentication

### `.requiresAuth(table)`
Enforces authentication and provides `$auth` variable.

**Parameters:**
- `table` (string): Authentication table name (e.g., '👤 users')

**Example:**
```javascript
.requiresAuth('👤 users')
// Now $auth.id, $auth.email, etc. are available
```

### `.precondition(condition, message, statusCode)`
Validates a condition before continuing execution.

**Parameters:**
- `condition` (string): Boolean expression
- `message` (string): Error message if condition fails
- `statusCode` (number): HTTP status code (optional, default: 400)

**Example:**
```javascript
.precondition('$auth.role == "admin"', 'Admin access required', 403)
.precondition('$input.amount > 0', 'Amount must be positive')
```

### `.verifyPassword(password, hash, alias)`
Verifies a password against its hash.

**Parameters:**
- `password` (string): Plain text password
- `hash` (string): Password hash
- `alias` (string): Variable name for result (boolean)

**Example:**
```javascript
.verifyPassword('$input.password', '$user.password_hash', 'password_valid')
.conditional('$password_valid == false')
  .then(e => e.response({ error: 'Invalid password' }))
.endConditional()
```

### `.hashPassword(password, alias)`
Hashes a password using SHA256.

**Parameters:**
- `password` (string): Plain text password
- `alias` (string): Variable name for hash

**Example:**
```javascript
.hashPassword('$input.new_password', 'password_hash')
```

### `.createToken(payload, expiry, alias)` ⚠️
**WARNING**: This method has unclear signature and often fails. Consider using manual token creation.

### `.verifyToken(token, alias)`
Verifies an authentication token.

**Parameters:**
- `token` (string): Token to verify
- `alias` (string): Variable name for decoded token data

**Example:**
```javascript
.verifyToken('$input.token', 'token_data')
```

## Variables & Control Flow

### `.var(name, value)`
Creates or updates a variable.

**Parameters:**
- `name` (string): Variable name
- `value` (any): Variable value (can include filters)

**Example:**
```javascript
.var('greeting', '"Hello, "|concat:$input.name')
.var('is_admin', '$auth.role == "admin"')
.var('counter', 0)
```

### `.varUpdate(name, value)`
Updates an existing variable (same as `.var()`).

**Parameters:**
- `name` (string): Variable name
- `value` (any): New value

**Example:**
```javascript
.varUpdate('counter', '$counter + 1')
```

### `.conditional(expression)`
Starts a conditional block.

**Parameters:**
- `expression` (string): Boolean expression

**Returns:** Conditional builder for chaining `.then()` and `.else()`

**Example:**
```javascript
.conditional('$user.status == "active"')
  .then(e => e
    .var('message', '"User is active"')
  )
  .else(e => e
    .var('message', '"User is inactive"')
  )
.endConditional()
```

### `.forEach(array, itemVar)`
Iterates over an array. Note the capital 'F' and 'E'.

**Parameters:**
- `array` (string): Array variable or expression
- `itemVar` (string): Variable name for current item

**Example:**
```javascript
.var('results', '[]')
.forEach('$input.items', 'item')
  .var('processed', '$item|uppercase')
  .varUpdate('results', '$results|push:$processed')
.endForEach()
```

### `.while(condition)`
Creates a while loop.

**Parameters:**
- `condition` (string): Loop condition

**Example:**
```javascript
.var('counter', 0)
.var('sum', 0)
.while('$counter < $input.max')
  .varUpdate('counter', '$counter + 1')
  .varUpdate('sum', '$sum + $counter')
.endWhile()
```

### `.for(init, condition, update)`
Creates a for loop.

**Parameters:**
- `init` (string): Initialization expression
- `condition` (string): Loop condition
- `update` (string): Update expression

**Example:**
```javascript
.for('i = 0', '$i < 10', 'i = $i + 1')
  .var('results', '$results|push:$i')
.endFor()
```

### `.lambda(code, timeout, alias)`
Executes custom JavaScript code.

**Parameters:**
- `code` (string): JavaScript code
- `timeout` (number): Execution timeout in seconds
- `alias` (string): Variable name for result

**Example:**
```javascript
.lambda(`
  return {
    formatted: $var.data.map(item => ({
      id: item.id,
      label: item.name.toUpperCase()
    }))
  };
`, 10, 'formatted_data')
```

## External APIs

### `.apiRequest(url, method, options, alias)`
Makes an external API request.

**Parameters:**
- `url` (string): API endpoint URL
- `method` (string): HTTP method
- `options` (object): Request configuration
  - `headers` (array): Headers (use `buildArray`)
  - `body` (object): Request body
  - `query` (object): Query parameters
  - `timeout` (number): Request timeout in seconds
- `alias` (string): Variable name for response

**Example:**
```javascript
.apiRequest('https://api.example.com/data', 'POST', {
  headers: buildArray([
    'Content-Type: application/json',
    'Authorization: Bearer |concat:$env.API_KEY'
  ]),
  body: buildObject({
    name: '$input.name',
    timestamp: 'now'
  }),
  timeout: 30
}, 'api_response')
```

### `.apiGet(url, options, alias)`
Shorthand for GET request.

**Parameters:**
- `url` (string): API endpoint URL
- `options` (object): Request options (headers, query, timeout)
- `alias` (string): Variable name for response

**Example:**
```javascript
.apiGet('https://api.example.com/user/' + '$input.id', {
  headers: buildArray(['Authorization: Bearer |concat:$env.TOKEN'])
}, 'user_data')
```

### `.apiPost(url, body, options, alias)`
Shorthand for POST request.

**Parameters:**
- `url` (string): API endpoint URL
- `body` (object): Request body
- `options` (object): Request options (headers, timeout)
- `alias` (string): Variable name for response

**Example:**
```javascript
.apiPost('https://api.sendgrid.com/v3/mail/send', 
  buildObject({
    to: [{ email: '$input.email' }],
    subject: 'Welcome!',
    content: [{ type: 'text/plain', value: 'Hello!' }]
  }),
  {
    headers: buildArray(['Authorization: Bearer |concat:$env.SENDGRID_KEY'])
  },
  'email_result')
```

## Storage Operations

### `.storageCreateFile(filename, content, alias)`
Creates a file in storage.

**Parameters:**
- `filename` (string): File name
- `content` (string): File content (base64 for binary)
- `alias` (string): Variable name for file resource

**Example:**
```javascript
.storageCreateFile('report.txt', '$report_content', 'file')
```

### `.storageCreateImage(imageData, alias)`
Creates an image in storage.

**Parameters:**
- `imageData` (string): Image data or file reference
- `alias` (string): Variable name for image resource

**Example:**
```javascript
.storageCreateImage('$input.avatar', 'image')
```

### `.storageGetFile(fileId, alias)`
Retrieves a file from storage.

**Parameters:**
- `fileId` (string): File identifier
- `alias` (string): Variable name for file content

**Example:**
```javascript
.storageGetFile('$input.file_id', 'file_content')
```

## Redis Operations

### `.redisGet(key, alias)`
Gets value from Redis cache.

**Parameters:**
- `key` (string): Cache key
- `alias` (string): Variable name for value

**Example:**
```javascript
.redisGet('user:' + '$input.id', 'cached_user')
```

### `.redisSet(key, value, ttl)`
Sets value in Redis cache.

**Parameters:**
- `key` (string): Cache key
- `value` (any): Value to cache
- `ttl` (number): Time to live in seconds (optional)

**Example:**
```javascript
.redisSet('user:' + '$user.id', '$user', 3600)
```

### `.redisDelete(key)`
Deletes value from Redis cache.

**Parameters:**
- `key` (string): Cache key

**Example:**
```javascript
.redisDelete('user:' + '$input.id')
```

### `.redisIncr(key, amount, alias)`
Increments a Redis counter.

**Parameters:**
- `key` (string): Counter key
- `amount` (number): Increment amount (optional, default: 1)
- `alias` (string): Variable name for new value

**Example:**
```javascript
.redisIncr('api_calls:' + '$auth.id', 1, 'call_count')
```

**Note**: Many Redis operations (keys, ttl, expire, etc.) are not supported despite being mentioned in some docs.

## Utility Functions

### `.createUuid(alias)`
Generates a UUID.

**Parameters:**
- `alias` (string): Variable name for UUID

**Example:**
```javascript
.createUuid('verification_token')
```

### `.utilSleep(seconds)`
Pauses execution.

**Parameters:**
- `seconds` (number): Sleep duration

**Example:**
```javascript
.utilSleep(2) // Wait 2 seconds
```

### `.log(value)`
Logs a value (use sparingly in production).

**Parameters:**
- `value` (any): Value to log

**Example:**
```javascript
.log('Processing user: ' + '$user.id')
```

### `.stop()`
Stops execution and returns current response.

**Example:**
```javascript
.conditional('$error != null')
  .then(e => e
    .response({ error: '$error' })
    .stop()
  )
.endConditional()
```

### `.return(value)`
Returns a value from a function (functions only).

**Parameters:**
- `value` (any): Return value

**Example:**
```javascript
// In a function
.return({ success: true, data: '$result' })
```

### `.callFunction(name, args, alias)`
Calls another function.

**Parameters:**
- `name` (string): Function name
- `args` (object): Function arguments
- `alias` (string): Variable name for return value

**Example:**
```javascript
.callFunction('calculate_tax', 
  { amount: '$input.amount', rate: 0.08 },
  'tax_amount')
```

## Global Functions

These functions are globally available without import:

### `buildObject(properties)`
Creates an object using filter chains.

**Parameters:**
- `properties` (object): Object properties

**Returns:** Filter chain string

**Example:**
```javascript
buildObject({
  name: '$input.name',
  status: 'active',
  metadata: buildObject({
    created: 'now',
    version: 1
  })
})
// Generates: {}|set:"name":$input.name|set:"status":"active"|set:"metadata":{}|set:"created":now|set:"version":1
```

### `buildArray(items)`
Creates an array using filter chains.

**Parameters:**
- `items` (array): Array items

**Returns:** Filter chain string

**Example:**
```javascript
buildArray(['apple', '$input.fruit', 'cherry'])
// Generates: []|push:"apple"|push:$input.fruit|push:"cherry"
```

### `buildHeaders(pairs)`
Creates headers array for API requests.

**Parameters:**
- `pairs` (array): Array of [key, value] pairs

**Returns:** Headers array

**Example:**
```javascript
buildHeaders([
  ['Authorization', 'Bearer ' + '$env.API_KEY'],
  ['Content-Type', 'application/json']
])
```

## Filter Reference

Filters transform values using pipeline syntax: `value|filter:param1:param2`

### String Filters (37 verified)
- **Case**: `to_upper`, `to_lower`, `capitalize`, `title_case`, `snake_case`, `camel_case`, `pascal_case`, `kebab_case`
- **Trim**: `trim`, `ltrim`, `rtrim`
- **Transform**: `to_slug`, `to_ascii`, `escape_html`, `unescape_html`, `escape`, `addslashes`, `nl2br`
- **Analysis**: `word_count`, `strlen`
- **Manipulation**: `substr`, `replace`, `replace_all`, `split`, `explode`, `implode`, `concat` (NOT `add` for strings!)
- **Search**: `contains`, `starts_with`, `ends_with`
- **Padding**: `pad_left`, `pad_right`
- **Regex**: `regex_replace`, `regex_extract`, `regex_extract_all`
- **URL**: `url_parse`, `url_addarg`, `url_delarg`, `url_setarg`

### Array Filters
- **Info**: `count` (NOT `length`!), `first`, `last`
- **Transform**: `sort`, `reverse`, `unique`, `flatten`, `chunk`, `slice`, `merge`
- **Compare**: `intersect`, `diff`
- **Extract**: `keys`, `values`, `pluck`, `groupBy`
- **Join**: `join` (use `implode`)

### Number/Math Filters
- **Math**: `abs`, `round`, `ceil`, `floor`, `add`, `subtract`, `multiply`, `divide`, `pow`, `sqrt`, `min`, `max`
- **Format**: `number_format`, `toInt`, `toDecimal`

### Date/Time Filters
- **Format**: `format`, `timestamp`, `date`, `time`
- **Modify**: `addDays`, `addMonths`, `addYears`

### Timestamp Filters (5 new)
- `ms_to_seconds`, `to_seconds`, `from_ms`, `format`, `to_timestamp`

### Logical Filters (5 new)
- `is_null`, `is_empty`, `bitwise_and`, `bitwise_or`, `bitwise_xor`

### Common Filter Mistakes
| Wrong | Right | Purpose |
|-------|-------|---------|
| `\|length` | `\|count` | Array length |
| `\|length` | `\|strlen` | String length |
| `\|add:` | `\|concat:` | String concatenation |
| `\|times:` | `\|multiply:` | Multiplication |
| `\|date_format` | `\|format` | Date formatting |

## Important Notes

1. **Method Names Are Case-Sensitive**: `forEach` not `foreach`
2. **Filters Use Pipeline Syntax**: `$value\|filter:param`
3. **Quote String Literals**: `'"active"'` not `'active'` in expressions
4. **Database Queries Use 'filters' (plural)**: Not 'filter'
5. **Build Complex Objects as Variables First**: Then reference in response
6. **Always Return the Script**: `return endpoint.build().script;`
7. **Check Generated XanoScript**: Review the preview before deployment