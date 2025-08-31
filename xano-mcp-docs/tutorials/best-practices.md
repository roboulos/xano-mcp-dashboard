# Xano MCP Best Practices

This guide covers recommended patterns and practices for building production-ready applications with Xano MCP.

## Architecture Principles

### 1. Start with High-Level Tools

Always begin with the highest-level abstraction available:

```javascript
// ✅ Good: Use system generators
await xano_create_auth_system({
  user_table: "users",
  api_group_name: "Authentication"
});

// ❌ Avoid: Building auth from scratch
// (Unless you have specific requirements)
```

**Benefits:**
- Battle-tested patterns
- Consistent implementation
- 95% less code
- Fewer bugs

### 2. Design Your Data Model First

Before creating any endpoints, plan your database structure:

```javascript
// 1. Create tables with relationships in mind
await xano_create_table({
  name: "orders",
  fields: [
    { name: "user_id", type: "int", required: true },
    { name: "total", type: "decimal", required: true },
    { name: "status", type: "enum", 
      values: ["pending", "processing", "completed", "cancelled"] }
  ]
});

// 2. Add indexes for common queries
await xano_manage_table_indexes({
  table_id: ordersTableId,
  action: "create",
  fields: [
    { name: "user_id", op: "asc" },
    { name: "created_at", op: "desc" }
  ]
});

// 3. Create relationships
await xano_create_table_reference_field({
  table_id: ordersTableId,
  field_name: "user_id",
  tableref_id: usersTableId
});
```

### 3. Use Consistent Naming Conventions

Adopt a naming strategy and stick to it:

```javascript
// Tables: Plural, lowercase
tables: ["users", "products", "orders"]

// Fields: Snake_case
fields: ["first_name", "created_at", "is_active"]

// API Endpoints: RESTful conventions
GET    /products          // List
GET    /products/{id}     // Get one
POST   /products          // Create
PUT    /products/{id}     // Update
DELETE /products/{id}     // Delete

// API Groups: Descriptive names
groups: ["Public API", "Admin API", "Webhooks"]
```

## Database Best Practices

### 1. Optimize for Common Queries

Create indexes based on your access patterns:

```javascript
// For user lookup by email
await xano_manage_table_indexes({
  table_id: usersTableId,
  action: "create",
  fields: [{ name: "email", op: "asc" }],
  type: "unique"
});

// For time-based queries
await xano_manage_table_indexes({
  table_id: eventsTableId,
  action: "create",
  fields: [
    { name: "user_id", op: "asc" },
    { name: "created_at", op: "desc" }
  ]
});
```

### 2. Use Appropriate Field Types

Choose the right type for your data:

```javascript
// User table example with proper types
const userFields = [
  { name: "email", type: "email", required: true },        // Auto-validates
  { name: "password", type: "password", required: true },   // Auto-hashes
  { name: "age", type: "int" },                            // Not "decimal"
  { name: "balance", type: "decimal", precision: 10, scale: 2 },
  { name: "is_active", type: "bool", default: true },      // Not "boolean"
  { name: "avatar", type: "image" },                       // Built-in handling
  { name: "metadata", type: "json" },                      // Flexible data
  { name: "tags", type: "array" },                         // Multiple values
  { name: "location", type: "geo_point" }                  // Geographic data
];
```

### 3. Implement Soft Deletes

For important data, use soft deletes:

```javascript
// Add deleted_at field
await xano_add_field_to_schema({
  table_id: productsTableId,
  field_name: "deleted_at",
  field_type: "timestamp",
  nullable: true
});

// Update instead of delete
const endpoint = create('products/delete', 'DELETE')
  .requiresAuth('users')
  .input('id', 'int', { required: true })
  
  .dbEdit('products',
    { id: '$input.id' },
    { deleted_at: 'now' }
  )
  
  .response({ message: 'Product deleted' });

// Filter out deleted records in queries
.dbQuery('products', {
  filter: { deleted_at: null }
}, 'activeProducts')
```

## API Development Patterns

### 1. Consistent Error Handling

Implement a standard error response format:

```javascript
const endpoint = create('users/create', 'POST')
  .input('email', 'email', { required: true })
  .input('password', 'password', { required: true })
  
  // Check for existing user
  .dbGet('users', { email: '$input.email' }, 'existing')
  
  .conditional('$existing != null')
    .then(e => e
      .var('error', buildObject({
        code: 'USER_EXISTS',
        message: 'A user with this email already exists',
        field: 'email'
      }))
      .response({ error: '$error' }, 409)
    )
  .endConditional()
  
  // Continue with creation...
```

### 2. Input Validation

Always validate inputs thoroughly:

```javascript
const endpoint = create('orders/create', 'POST')
  // Type validation happens automatically
  .input('product_id', 'int', { required: true })
  .input('quantity', 'int', { required: true })
  .input('shipping_address', 'object', { required: true })
  
  // Additional business logic validation
  .precondition('$input.quantity > 0', 'Quantity must be positive')
  .precondition('$input.quantity <= 100', 'Maximum quantity is 100')
  
  // Validate related data exists
  .dbGet('products', { id: '$input.product_id' }, 'product')
  .precondition('$product != null', 'Product not found')
  .precondition('$product.in_stock >= $input.quantity', 'Insufficient stock')
  
  // Validate complex objects
  .precondition('$input.shipping_address.street != null', 'Street address required')
  .precondition('$input.shipping_address.postal_code|strlen >= 5', 'Invalid postal code')
```

### 3. Pagination for Lists

Always paginate list endpoints:

```javascript
const endpoint = create('products/list', 'GET')
  .input('page', 'int', { default: 1 })
  .input('per_page', 'int', { default: 20 })
  .input('category', 'text')
  .input('search', 'text')
  
  // Validate pagination params
  .precondition('$input.per_page <= 100', 'Maximum 100 items per page')
  
  // Build filter object
  .var('filter', buildObject({}))
  
  .conditional('$input.category != null')
    .then(e => e.var('filter', '$filter|set:"category":$input.category'))
  .endConditional()
  
  .conditional('$input.search != null')
    .then(e => e.var('filter', '$filter|set:"name":{"$contains":$input.search}'))
  .endConditional()
  
  // Query with pagination
  .dbQuery('products', {
    filter: '$filter',
    page: '$input.page',
    per_page: '$input.per_page',
    sort: { created_at: 'desc' }
  }, 'results')
  
  // Return paginated response
  .response({
    data: '$results.items',
    pagination: buildObject({
      page: '$results.curPage',
      per_page: '$input.per_page',
      total: '$results.itemsTotal',
      total_pages: '$results.totalPages',
      has_next: '$results.nextPage != null',
      has_prev: '$results.prevPage != null'
    })
  });
```

### 4. Secure File Uploads

Implement proper file upload security:

```javascript
const endpoint = create('upload/document', 'POST')
  .requiresAuth('users')
  .input('file', 'file', {
    required: true,
    maxSize: 10, // MB
    allowedExtensions: ['pdf', 'doc', 'docx']
  })
  .input('category', 'text', { required: true })
  
  // Scan for malware (if service available)
  .scanFile('$input.file', 'scanResult')
  .precondition('$scanResult.safe', 'File failed security scan')
  
  // Generate secure filename
  .var('filename', '$auth.id ~ "-" ~ $timestamp ~ "-" ~ $input.file.name')
  
  // Store file
  .createFile('$input.file', {
    filename: '$filename',
    folder: 'documents/$auth.id'
  }, 'uploaded')
  
  // Log upload
  .dbAdd('file_uploads', {
    user_id: '$auth.id',
    filename: '$filename',
    original_name: '$input.file.name',
    size: '$input.file.size',
    category: '$input.category',
    url: '$uploaded.url',
    uploaded_at: 'now'
  }, 'record')
  
  .response({
    id: '$record.id',
    url: '$uploaded.url',
    filename: '$filename'
  });
```

## Authentication & Security

### 1. Implement Proper Authentication

Use JWT tokens with appropriate expiration:

```javascript
// Configure auth system
await xano_create_auth_system({
  user_table: "users",
  session_duration: 3600,        // 1 hour for standard tokens
  refresh_token_duration: 604800 // 7 days for refresh tokens
});

// Protect sensitive endpoints
const endpoint = create('admin/users', 'GET')
  .requiresAuth('users')
  .precondition('$auth.role == "admin"', 'Admin access required')
  // ... rest of endpoint
```

### 2. Rate Limiting

Implement rate limiting for public endpoints:

```javascript
const endpoint = create('public/search', 'GET')
  .input('query', 'text', { required: true })
  
  // Check rate limit
  .rateLimit({
    key: '$ip',  // or '$auth.id' for authenticated users
    max: 100,
    window: 3600 // 1 hour
  })
  
  // Continue with search...
```

### 3. Input Sanitization

Sanitize user inputs to prevent XSS:

```javascript
const endpoint = create('comments/create', 'POST')
  .requiresAuth('users')
  .input('content', 'text', { required: true })
  
  // Sanitize HTML
  .var('safe_content', '$input.content|strip_tags|trim')
  
  // Or allow specific tags
  .var('safe_content', '$input.content|sanitize_html:["b","i","em","strong"]')
  
  .dbAdd('comments', {
    user_id: '$auth.id',
    content: '$safe_content',
    created_at: 'now'
  }, 'comment');
```

### 4. Secure Password Reset

Implement secure password reset flow:

```javascript
// Request reset
const requestReset = create('auth/request-reset', 'POST')
  .input('email', 'email', { required: true })
  
  .dbGet('users', { email: '$input.email' }, 'user')
  
  // Always return success (don't reveal if email exists)
  .conditional('$user != null')
    .then(e => e
      .var('token', generateSecureToken())
      .var('expires', '"now"|add_hours:1')
      
      .dbAdd('password_resets', {
        user_id: '$user.id',
        token: '$token',
        expires_at: '$expires'
      })
      
      .sendEmail({
        to: '$user.email',
        template: 'password-reset',
        variables: {
          name: '$user.name',
          reset_link: '$env.APP_URL ~ "/reset?token=" ~ $token'
        }
      })
    )
  .endConditional()
  
  .response({ message: 'If the email exists, a reset link has been sent' });
```

## Performance Optimization

### 1. Use Database Indexes Wisely

Create indexes for frequently queried fields:

```javascript
// Analyze query patterns first
const slowQueries = await xano_analyze_table({
  table_id: ordersTableId,
  options: {
    include_usage_stats: true
  }
});

// Create composite indexes for common filters
await xano_manage_table_indexes({
  table_id: ordersTableId,
  action: "create",
  fields: [
    { name: "user_id", op: "asc" },
    { name: "status", op: "asc" },
    { name: "created_at", op: "desc" }
  ]
});
```

### 2. Optimize Large Queries

Use field selection and limits:

```javascript
// ❌ Bad: Fetching everything
.dbQuery('users', {}, 'allUsers')

// ✅ Good: Fetch only what you need
.dbQuery('users', {
  filter: { active: true },
  output: ['id', 'name', 'email'], // Only needed fields
  limit: 100,
  sort: { created_at: 'desc' }
}, 'activeUsers')
```

### 3. Implement Caching

Cache expensive operations:

```javascript
const endpoint = create('stats/dashboard', 'GET')
  .requiresAuth('users')
  
  // Check cache first
  .cache('dashboard_stats_' ~ $auth.id, 300) // 5 minutes
    .then(e => e
      // Calculate expensive stats
      .dbQuery('orders', {
        filter: { user_id: '$auth.id' }
      }, 'orders')
      
      .var('stats', buildObject({
        total_orders: '$orders.itemsTotal',
        total_spent: '$orders.items|pluck:"total"|sum',
        average_order: '$orders.items|pluck:"total"|avg'
      }))
    )
  .endCache()
  
  .response({ stats: '$stats' });
```

### 4. Batch Operations

Process large datasets efficiently:

```javascript
const endpoint = create('maintenance/update-prices', 'POST')
  .requiresAuth('admins')
  .input('increase_percent', 'decimal', { required: true })
  
  .var('processed', 0)
  .var('page', 1)
  
  // Process in batches
  .while('true')
    .dbQuery('products', {
      page: '$page',
      per_page: 100
    }, 'batch')
    
    // Exit if no more records
    .conditional('$batch.items|count == 0')
      .then(e => e.break())
    .endConditional()
    
    // Update each product
    .foreach('$batch.items', 'product')
      .var('new_price', '$product.price|multiply:$input.increase_percent|divide:100|add:$product.price')
      
      .dbEdit('products',
        { id: '$product.id' },
        { price: '$new_price|round:2' }
      )
      
      .var('processed', '$processed|add:1')
    .endForeach()
    
    .var('page', '$page|add:1')
  .endWhile()
  
  .response({ processed: '$processed' });
```

## Testing Strategies

### 1. Create Test Endpoints

Build endpoints specifically for testing:

```javascript
const testEndpoint = create('test/create-test-data', 'POST')
  .requiresAuth('admins')
  .input('count', 'int', { default: 10 })
  
  .var('created', [])
  
  .for('$input.count')
    .var('testUser', buildObject({
      email: '"test" ~ $index ~ "@example.com"',
      name: '"Test User " ~ $index',
      password: 'password123'
    }))
    
    .dbAdd('users', '$testUser', 'user')
    .var('created', '$created|push:$user')
  .endFor()
  
  .response({ created: '$created' });
```

### 2. Use Test Credentials

Create test users with specific roles:

```javascript
// Create test users for each role
const testUsers = [
  { email: "admin@test.com", role: "admin" },
  { email: "user@test.com", role: "user" },
  { email: "moderator@test.com", role: "moderator" }
];

// Test different permission levels
for (const testUser of testUsers) {
  const result = await xano_test_endpoint({
    endpoint_url: "https://api.example.com/admin/users",
    test_credentials: testUser
  });
  
  console.log(`${testUser.role}: ${result.status}`);
}
```

### 3. Automated Testing

Create test suites for your APIs:

```javascript
const runTests = async () => {
  const tests = [
    {
      name: "User Registration",
      endpoint: "/auth/register",
      method: "POST",
      data: {
        email: "newuser@test.com",
        password: "Test123!",
        name: "New User"
      },
      expected: {
        status: 201,
        hasToken: true
      }
    },
    {
      name: "Duplicate Registration",
      endpoint: "/auth/register",
      method: "POST",
      data: {
        email: "existing@test.com",
        password: "Test123!"
      },
      expected: {
        status: 409,
        error: "USER_EXISTS"
      }
    }
  ];
  
  for (const test of tests) {
    const result = await xano_test_endpoint({
      endpoint_url: `${baseUrl}${test.endpoint}`,
      method: test.method,
      payload: test.data
    });
    
    console.log(`${test.name}: ${
      result.status === test.expected.status ? '✅' : '❌'
    }`);
  }
};
```

## Deployment Best Practices

### 1. Use Version Control

Track your SDK code in Git:

```javascript
// endpoints/auth/login.js
export const loginEndpoint = () => {
  const endpoint = create('login', 'POST')
    .input('email', 'email', { required: true })
    .input('password', 'password', { required: true })
    // ... rest of endpoint
    
  return endpoint.build().script;
};

// Deploy from version control
const script = loginEndpoint();
await middleware_deploy_sdk_code({
  sdk_code: script,
  api_group_id: authGroupId
});
```

### 2. Environment-Specific Configuration

Use environment variables for different stages:

```javascript
// Development
STRIPE_SECRET_KEY=sk_test_...
API_URL=https://dev.api.example.com

// Production  
STRIPE_SECRET_KEY=sk_live_...
API_URL=https://api.example.com
```

### 3. Gradual Rollout

Test changes before full deployment:

```javascript
// 1. Deploy to test endpoint
await middleware_deploy_sdk_code({
  sdk_code: newEndpointCode,
  endpoint_name: "users-v2-test"
});

// 2. Run tests
await runTestSuite("users-v2-test");

// 3. Deploy to production
await middleware_update_sdk_code({
  api_id: productionEndpointId,
  sdk_code: newEndpointCode
});
```

### 4. Monitor After Deployment

Set up monitoring for new deployments:

```javascript
const monitorDeployment = async () => {
  // Check error rate
  const logs = await xano_browse_logs({
    level: "error",
    time_range: { last_hours: 1 }
  });
  
  // Check performance
  const metrics = await xano_monitor_workspace({
    monitoring_type: "performance",
    time_range: { last_hours: 1 }
  });
  
  // Alert if issues
  if (logs.length > threshold || metrics.avg_response_time > 1000) {
    await sendAlert("Deployment issues detected");
  }
};
```

## Common Pitfalls to Avoid

### 1. Not Using Transactions
```javascript
// ❌ Bad: Multiple operations without transaction
.dbEdit('inventory', { id: 1 }, { quantity: '$current - 1' })
.dbAdd('orders', orderData)  // Could fail, leaving inventory wrong

// ✅ Good: Use grouped operations
.group()
  .dbEdit('inventory', { id: 1 }, { quantity: '$current - 1' })
  .dbAdd('orders', orderData)
.endGroup()
```

### 2. Exposing Sensitive Data
```javascript
// ❌ Bad: Returning all user fields
.dbGet('users', { id: '$input.id' }, 'user')
.response({ user: '$user' })  // Includes password hash!

// ✅ Good: Select specific fields
.dbGet('users', { id: '$input.id' }, 'user')
.var('publicProfile', buildObject({
  id: '$user.id',
  name: '$user.name',
  email: '$user.email',
  avatar: '$user.avatar_url'
}))
.response({ user: '$publicProfile' })
```

### 3. Inefficient Loops
```javascript
// ❌ Bad: Database call in loop
.foreach('$userIds', 'userId')
  .dbGet('users', { id: '$userId' }, 'user')  // N queries!
.endForeach()

// ✅ Good: Single query with filter
.dbQuery('users', {
  filter: { id: { $in: '$userIds' } }
}, 'users')
```

## Summary Checklist

Before deploying to production, ensure:

- [ ] All inputs are validated
- [ ] Error responses are consistent
- [ ] Authentication is properly implemented
- [ ] Sensitive data is not exposed
- [ ] Database queries are optimized with indexes
- [ ] Large result sets are paginated
- [ ] File uploads are secured
- [ ] Rate limiting is in place
- [ ] Environment variables are used
- [ ] Code is tested thoroughly
- [ ] Monitoring is configured
- [ ] Documentation is updated

Following these best practices will help you build robust, scalable, and maintainable applications with Xano MCP!