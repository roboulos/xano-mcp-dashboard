# Xano MCP SDK Common Patterns

## Table of Contents
- [Authentication Patterns](#authentication-patterns)
- [Database Patterns](#database-patterns)
- [Error Handling](#error-handling)
- [Caching Strategies](#caching-strategies)
- [External API Integration](#external-api-integration)
- [File Handling](#file-handling)
- [Advanced Patterns](#advanced-patterns)
- [Performance Optimization](#performance-optimization)

## Authentication Patterns

### Basic Login Flow
```javascript
const endpoint = create('login', 'POST')
  .input('email', 'email', { required: true })
  .input('password', 'password', { required: true })
  
  // Find user by email
  .dbGet('👤 users', { email: '$input.email' }, 'user')
  .precondition('$user != null', 'User not found')
  
  // Verify password
  .verifyPassword('$input.password', '$user.password', 'password_valid')
  .precondition('$password_valid == true', 'Invalid password')
  
  // Create auth token
  .createToken({
    dbtable: '👤 users',
    id: '$user.id'
  }, 86400, 'authToken')  // 24 hour expiry
  
  .response({
    token: '$authToken',
    user: buildObject({
      id: '$user.id',
      email: '$user.email',
      name: '$user.name'
    })
  });

return endpoint.build().script;
```

### Registration with Email Verification
```javascript
const endpoint = create('register', 'POST')
  .input('email', 'email', { required: true })
  .input('password', 'password', { required: true })
  .input('name', 'text', { required: true })
  
  // Check if user exists
  .dbGet('👤 users', { email: '$input.email' }, 'existing')
  .conditional('$existing != null')
    .then(e => e
      .response({ error: 'Email already registered' })
      .stop()
    )
  .endConditional()
  
  // Hash password and create verification token
  .hashPassword('$input.password', 'password_hash')
  .createUuid('verification_token')
  
  // Create user
  .dbAdd('👤 users', {
    email: '$input.email',
    password: '$password_hash',
    name: '$input.name',
    email_verified: false,
    email_verification_token: '$verification_token',
    created_at: 'now'
  }, 'new_user')
  
  // Build verification link
  .var('verification_link', 
    '$env.APP_URL|concat:"/verify-email?token="|concat:$verification_token')
  
  // Send verification email via SendGrid
  .apiPost('https://api.sendgrid.com/v3/mail/send',
    buildObject({
      personalizations: [{
        to: [{ email: '$new_user.email' }],
        dynamic_template_data: buildObject({
          name: '$new_user.name',
          verification_link: '$verification_link'
        })
      }],
      from: { email: '$env.FROM_EMAIL' },
      template_id: '$env.SENDGRID_VERIFICATION_TEMPLATE'
    }),
    {
      headers: buildArray([
        'Authorization: Bearer |concat:$env.SENDGRID_KEY',
        'Content-Type: application/json'
      ])
    },
    'email_result'
  )
  
  .response({
    message: 'Registration successful. Please check your email.',
    user_id: '$new_user.id'
  });

return endpoint.build().script;
```

### Protected Endpoint with Role Check
```javascript
const endpoint = create('admin-dashboard', 'GET')
  .requiresAuth('👤 users')
  .precondition('$auth.role == "admin"', 'Admin access required', 403)
  
  // Admin-only logic here
  .dbQuery('system_logs', {
    filters: {},
    pagination: { page: 1, per_page: 100 },
    sort: { field: 'created_at', direction: 'desc' }
  }, 'logs')
  
  .response({ data: '$logs' });

return endpoint.build().script;
```

## Database Patterns

### CRUD with Dynamic Filtering
```javascript
const endpoint = create('list-products', 'GET')
  .input('category', 'text', { required: false })
  .input('min_price', 'decimal', { required: false })
  .input('max_price', 'decimal', { required: false })
  .input('page', 'int', { defaultValue: 1 })
  .input('per_page', 'int', { defaultValue: 20 })
  
  // Build dynamic filters
  .var('filters', '{}')
  
  .conditional('$input.category != null')
    .then(e => e.varUpdate('filters', '$filters|set:"category":$input.category'))
  .endConditional()
  
  .conditional('$input.min_price != null')
    .then(e => e.varUpdate('filters', '$filters|set:"price":{"$gte":$input.min_price}'))
  .endConditional()
  
  .conditional('$input.max_price != null')
    .then(e => e.varUpdate('filters', '$filters|set:"price":{"$lte":$input.max_price}'))
  .endConditional()
  
  // Query with dynamic filters
  .dbQuery('products', {
    filters: '$filters',
    pagination: { 
      page: '$input.page', 
      per_page: '$input.per_page' 
    }
  }, 'products')
  
  .response({
    data: '$products.items',
    pagination: buildObject({
      page: '$products.curPage',
      total_pages: '$products.pageTotal',
      total_items: '$products.itemsTotal'
    })
  });

return endpoint.build().script;
```

### Soft Delete Pattern
```javascript
const endpoint = create('delete-post', 'DELETE')
  .requiresAuth('👤 users')
  .input('id', 'int', { required: true })
  
  // Get post and verify ownership
  .dbGet('posts', { id: '$input.id' }, 'post')
  .precondition('$post != null', 'Post not found', 404)
  .precondition('$post.author_id == $auth.id || $auth.role == "admin"', 
    'Not authorized to delete this post', 403)
  
  // Soft delete
  .dbEdit('posts',
    { id: '$input.id' },
    {
      deleted_at: 'now',
      deleted_by: '$auth.id'
    },
    'deleted_post'
  )
  
  .response({ 
    message: 'Post deleted successfully',
    id: '$deleted_post.id'
  });

return endpoint.build().script;
```

### Batch Processing with Transactions
```javascript
const endpoint = create('batch-update-prices', 'POST')
  .requiresAuth('👤 users')
  .precondition('$auth.role == "admin"', 'Admin access required')
  .input('updates', 'object', { required: true })
  
  .var('results', '[]')
  .var('errors', '[]')
  
  // Process each update
  .forEach('$input.updates', 'update')
    // Validate update data
    .conditional('$update.id == null || $update.new_price == null')
      .then(e => e
        .varUpdate('errors', '$errors|push:"Invalid update data"')
      )
      .else(e => e
        // Update product
        .dbEdit('products',
          { id: '$update.id' },
          { 
            price: '$update.new_price',
            updated_at: 'now',
            updated_by: '$auth.id'
          },
          'updated_product'
        )
        .varUpdate('results', '$results|push:$updated_product')
      )
    .endConditional()
  .endForEach()
  
  .response({
    success: '$results|count',
    errors: '$errors|count',
    results: '$results'
  });

return endpoint.build().script;
```

## Error Handling

### Comprehensive Error Pattern
```javascript
const endpoint = create('process-payment', 'POST')
  .requiresAuth('👤 users')
  .input('amount', 'decimal', { required: true })
  .input('payment_method_id', 'text', { required: true })
  
  // Initialize error tracking
  .var('error', null)
  .var('error_code', null)
  
  // Validate amount
  .conditional('$input.amount <= 0')
    .then(e => e
      .var('error', '"Amount must be greater than 0"')
      .var('error_code', '"INVALID_AMOUNT"')
    )
  .endConditional()
  
  // Check for errors and stop
  .conditional('$error != null')
    .then(e => e
      .response({ 
        error: '$error',
        code: '$error_code' 
      })
      .stop()
    )
  .endConditional()
  
  // Process payment with external API
  .apiPost('https://api.stripe.com/v1/payment_intents',
    buildObject({
      amount: '$input.amount * 100',  // Convert to cents
      currency: 'usd',
      payment_method: '$input.payment_method_id',
      confirm: true
    }),
    {
      headers: buildArray([
        'Authorization: Bearer |concat:$env.STRIPE_SECRET',
        'Content-Type: application/x-www-form-urlencoded'
      ])
    },
    'payment_result'
  )
  
  // Check API response
  .conditional('$payment_result.error != null')
    .then(e => e
      .var('error', '$payment_result.error.message')
      .var('error_code', '$payment_result.error.code')
      .response({ 
        error: '$error',
        code: '$error_code' 
      })
      .stop()
    )
  .endConditional()
  
  // Success response
  .response({
    success: true,
    payment_id: '$payment_result.id',
    status: '$payment_result.status'
  });

return endpoint.build().script;
```

### Try-Catch Pattern with Logging
```javascript
const endpoint = create('risky-operation', 'POST')
  .requiresAuth('👤 users')
  .input('data', 'object', { required: true })
  
  .var('operation_id', 'uuid')
  .var('start_time', 'now')
  
  // Log operation start
  .dbAdd('operation_logs', {
    id: '$operation_id',
    user_id: '$auth.id',
    operation: 'risky_operation',
    status: 'started',
    input_data: '$input.data',
    started_at: '$start_time'
  }, 'log_entry')
  
  // Perform risky operation
  .var('result', null)
  .var('error', null)
  
  // Simulate operation that might fail
  .conditional('$input.data.force_error == true')
    .then(e => e
      .var('error', '"Forced error for testing"')
    )
    .else(e => e
      // Normal operation
      .var('result', buildObject({
        processed: true,
        timestamp: 'now'
      }))
    )
  .endConditional()
  
  // Log completion
  .dbEdit('operation_logs',
    { id: '$operation_id' },
    {
      status: '$error != null ? "failed" : "completed"',
      error: '$error',
      result: '$result',
      completed_at: 'now',
      duration_ms: '(now - $start_time) * 1000'
    },
    'updated_log'
  )
  
  // Return appropriate response
  .conditional('$error != null')
    .then(e => e
      .response({ 
        error: '$error',
        operation_id: '$operation_id'
      })
    )
    .else(e => e
      .response({ 
        success: true,
        result: '$result',
        operation_id: '$operation_id'
      })
    )
  .endConditional();

return endpoint.build().script;
```

## Caching Strategies

### Cache-Aside Pattern
```javascript
const endpoint = create('get-user-profile', 'GET')
  .input('user_id', 'int', { required: true })
  
  // Try cache first
  .var('cache_key', '"user:"|concat:$input.user_id')
  .redisGet('$cache_key', 'cached_user')
  
  .conditional('$cached_user != null')
    .then(e => e
      // Cache hit
      .response({ 
        data: '$cached_user',
        from_cache: true 
      })
      .stop()
    )
  .endConditional()
  
  // Cache miss - get from database
  .dbGet('users', { id: '$input.user_id' }, 'user')
  .precondition('$user != null', 'User not found', 404)
  
  // Get additional data
  .dbCount('posts', { author_id: '$user.id' }, 'post_count')
  .dbCount('followers', { following_id: '$user.id' }, 'follower_count')
  
  // Build complete profile
  .var('profile', buildObject({
    id: '$user.id',
    name: '$user.name',
    email: '$user.email',
    bio: '$user.bio',
    stats: buildObject({
      posts: '$post_count',
      followers: '$follower_count'
    })
  }))
  
  // Cache for 1 hour
  .redisSet('$cache_key', '$profile', 3600)
  
  .response({ 
    data: '$profile',
    from_cache: false 
  });

return endpoint.build().script;
```

### Write-Through Cache
```javascript
const endpoint = create('update-user-settings', 'PUT')
  .requiresAuth('👤 users')
  .input('settings', 'object', { required: true })
  
  // Update database
  .dbEdit('users',
    { id: '$auth.id' },
    {
      settings: '$input.settings',
      updated_at: 'now'
    },
    'updated_user'
  )
  
  // Update cache immediately
  .var('cache_key', '"user:"|concat:$auth.id')
  .redisSet('$cache_key', '$updated_user', 3600)
  
  // Invalidate related caches
  .redisDelete('"user_list:page:1"')
  .redisDelete('"user_stats:total"')
  
  .response({ 
    success: true,
    settings: '$updated_user.settings'
  });

return endpoint.build().script;
```

### Rate Limiting Pattern
```javascript
const endpoint = create('send-message', 'POST')
  .requiresAuth('👤 users')
  .input('recipient_id', 'int', { required: true })
  .input('message', 'text', { required: true })
  
  // Rate limit key
  .var('rate_key', '"rate_limit:message:"|concat:$auth.id')
  
  // Check current count
  .redisGet('$rate_key', 'current_count')
  .var('count', '$current_count != null ? $current_count : 0')
  
  // Check rate limit (10 messages per hour)
  .conditional('$count >= 10')
    .then(e => e
      .response({ 
        error: 'Rate limit exceeded. Maximum 10 messages per hour.',
        retry_after: 3600
      })
      .stop()
    )
  .endConditional()
  
  // Send message
  .dbAdd('messages', {
    sender_id: '$auth.id',
    recipient_id: '$input.recipient_id',
    message: '$input.message',
    created_at: 'now'
  }, 'new_message')
  
  // Increment rate limit counter
  .redisIncr('$rate_key', 1, 'new_count')
  
  // Set expiry if first message
  .conditional('$current_count == null')
    .then(e => e
      .redisExpire('$rate_key', 3600)  // 1 hour
    )
  .endConditional()
  
  .response({
    success: true,
    message_id: '$new_message.id',
    remaining: '10 - $new_count'
  });

return endpoint.build().script;
```

## External API Integration

### Resilient API Call with Retry
```javascript
const endpoint = create('fetch-weather', 'GET')
  .input('city', 'text', { required: true })
  
  .var('attempts', 0)
  .var('max_attempts', 3)
  .var('weather_data', null)
  .var('error', null)
  
  // Retry loop
  .while('$attempts < $max_attempts && $weather_data == null')
    .varUpdate('attempts', '$attempts + 1')
    
    // Make API call
    .apiGet('https://api.openweathermap.org/data/2.5/weather', {
      query: buildObject({
        q: '$input.city',
        appid: '$env.OPENWEATHER_API_KEY',
        units: 'metric'
      }),
      timeout: 5
    }, 'api_response')
    
    // Check response
    .conditional('$api_response.cod == 200')
      .then(e => e
        .var('weather_data', '$api_response')
      )
      .else(e => e
        .var('error', '$api_response.message')
        // Wait before retry (exponential backoff)
        .conditional('$attempts < $max_attempts')
          .then(e => e.utilSleep('$attempts * 2'))
        .endConditional()
      )
    .endConditional()
  .endWhile()
  
  // Return result
  .conditional('$weather_data != null')
    .then(e => e
      .response({
        temperature: '$weather_data.main.temp',
        description: '$weather_data.weather[0].description',
        humidity: '$weather_data.main.humidity',
        wind_speed: '$weather_data.wind.speed'
      })
    )
    .else(e => e
      .response({
        error: 'Failed to fetch weather data',
        details: '$error',
        attempts: '$attempts'
      })
    )
  .endConditional();

return endpoint.build().script;
```

### Webhook Processing with Verification
```javascript
const endpoint = create('stripe-webhook', 'POST')
  .input('payload', 'text', { required: true })
  .input('stripe_signature', 'text', { required: true })
  
  // Verify webhook signature (simplified - use proper HMAC in production)
  .var('expected_signature', '$env.STRIPE_WEBHOOK_SECRET|hmac:"sha256":$input.payload')
  .precondition('$input.stripe_signature == $expected_signature', 
    'Invalid webhook signature', 401)
  
  // Parse event
  .var('event', '$input.payload|from_json')
  
  // Handle different event types
  .conditional('$event.type == "payment_intent.succeeded"')
    .then(e => e
      // Update order status
      .dbEdit('orders',
        { stripe_payment_intent_id: '$event.data.object.id' },
        {
          status: 'paid',
          paid_at: 'now',
          payment_details: '$event.data.object'
        },
        'updated_order'
      )
      
      // Send confirmation email
      .apiPost('https://api.sendgrid.com/v3/mail/send',
        buildObject({
          to: [{ email: '$updated_order.customer_email' }],
          from: { email: '$env.FROM_EMAIL' },
          subject: 'Payment Confirmed',
          content: [{
            type: 'text/plain',
            value: '"Your payment for order #"|concat:$updated_order.id|concat:" has been confirmed."'
          }]
        }),
        {
          headers: buildArray([
            'Authorization: Bearer |concat:$env.SENDGRID_KEY'
          ])
        },
        'email_result'
      )
    )
  .endConditional()
  
  .conditional('$event.type == "payment_intent.payment_failed"')
    .then(e => e
      // Handle failed payment
      .dbEdit('orders',
        { stripe_payment_intent_id: '$event.data.object.id' },
        {
          status: 'payment_failed',
          failed_at: 'now',
          failure_reason: '$event.data.object.last_payment_error.message'
        },
        'failed_order'
      )
    )
  .endConditional()
  
  // Always return 200 to acknowledge receipt
  .response({ received: true });

return endpoint.build().script;
```

## File Handling

### Image Upload with Processing
```javascript
const endpoint = create('upload-avatar', 'POST')
  .requiresAuth('👤 users')
  .input('image', 'image', { required: true })
  
  // Validate image
  .precondition('$input.image.size <= 5242880', 
    'Image must be less than 5MB')
  .precondition('$input.image.type|contains:"image/"', 
    'File must be an image')
  
  // Create unique filename
  .var('filename', '"avatar_"|concat:$auth.id|concat:"_"|concat:now|concat:".jpg"')
  
  // Store image
  .storageCreateImage('$input.image', 'stored_image')
  
  // Delete old avatar if exists
  .conditional('$auth.avatar_url != null')
    .then(e => e
      .storageDelete('$auth.avatar_url')
    )
  .endConditional()
  
  // Update user profile
  .dbEdit('users',
    { id: '$auth.id' },
    {
      avatar_url: '$stored_image.url',
      avatar_updated_at: 'now'
    },
    'updated_user'
  )
  
  // Clear user cache
  .redisDelete('"user:"|concat:$auth.id')
  
  .response({
    success: true,
    avatar_url: '$stored_image.url'
  });

return endpoint.build().script;
```

### CSV Import Processing
```javascript
const endpoint = create('import-products', 'POST')
  .requiresAuth('👤 users')
  .precondition('$auth.role == "admin"', 'Admin access required')
  .input('csv_file', 'file', { required: true })
  
  // Parse CSV
  .var('csv_content', '$input.csv_file.content|base64_decode')
  .var('rows', '$csv_content|split:"\\n"')
  .var('headers', '$rows[0]|split:","')
  
  // Remove header row
  .varUpdate('rows', '$rows|slice:1')
  
  // Process results
  .var('imported', 0)
  .var('errors', '[]')
  
  // Process each row
  .forEach('$rows', 'row')
    .var('columns', '$row|split:","')
    
    // Skip empty rows
    .conditional('$columns|count > 1')
      .then(e => e
        // Map CSV columns to product data
        .var('product_data', buildObject({
          name: '$columns[0]|trim',
          description: '$columns[1]|trim',
          price: '$columns[2]|trim|toDecimal',
          category: '$columns[3]|trim',
          stock: '$columns[4]|trim|toInt',
          created_by: '$auth.id',
          created_at: 'now'
        }))
        
        // Validate required fields
        .conditional('$product_data.name != "" && $product_data.price > 0')
          .then(e => e
            // Import product
            .dbAdd('products', '$product_data', 'new_product')
            .varUpdate('imported', '$imported + 1')
          )
          .else(e => e
            // Record error
            .varUpdate('errors', '$errors|push:"Invalid data in row"')
          )
        .endConditional()
      )
    .endConditional()
  .endForEach()
  
  // Create import log
  .dbAdd('import_logs', {
    type: 'products',
    file_name: '$input.csv_file.name',
    total_rows: '$rows|count',
    imported: '$imported',
    errors: '$errors|count',
    error_details: '$errors',
    imported_by: '$auth.id',
    created_at: 'now'
  }, 'import_log')
  
  .response({
    success: true,
    imported: '$imported',
    errors: '$errors|count',
    total_rows: '$rows|count',
    import_id: '$import_log.id'
  });

return endpoint.build().script;
```

## Advanced Patterns

### Pagination with Cursor
```javascript
const endpoint = create('list-messages-cursor', 'GET')
  .requiresAuth('👤 users')
  .input('cursor', 'text', { required: false })
  .input('limit', 'int', { defaultValue: 20 })
  
  // Build query based on cursor
  .var('filters', buildObject({ recipient_id: '$auth.id' }))
  
  .conditional('$input.cursor != null')
    .then(e => e
      // Decode cursor (base64 encoded timestamp)
      .var('cursor_timestamp', '$input.cursor|base64_decode')
      .varUpdate('filters', '$filters|set:"created_at":{"$lt":$cursor_timestamp}')
    )
  .endConditional()
  
  // Query with extra item for next cursor
  .dbQuery('messages', {
    filters: '$filters',
    limit: '$input.limit + 1',
    sort: { field: 'created_at', direction: 'desc' }
  }, 'messages')
  
  // Check if there's a next page
  .var('has_next', '$messages|count > $input.limit')
  .var('items', '$has_next ? $messages|slice:0:$input.limit : $messages')
  
  // Generate next cursor
  .var('next_cursor', null)
  .conditional('$has_next')
    .then(e => e
      .var('last_item', '$items|last')
      .var('next_cursor', '$last_item.created_at|base64_encode')
    )
  .endConditional()
  
  .response({
    data: '$items',
    pagination: buildObject({
      has_next: '$has_next',
      next_cursor: '$next_cursor'
    })
  });

return endpoint.build().script;
```

### Multi-Tenancy Pattern
```javascript
const endpoint = create('tenant-data', 'GET')
  .requiresAuth('👤 users')
  .input('resource', 'text', { required: true })
  
  // Get user's tenant
  .dbGet('user_tenants', { user_id: '$auth.id' }, 'user_tenant')
  .precondition('$user_tenant != null', 'No tenant access')
  
  // Scope all queries by tenant
  .var('base_filter', buildObject({ tenant_id: '$user_tenant.tenant_id' }))
  
  // Route to appropriate resource
  .conditional('$input.resource == "projects"')
    .then(e => e
      .dbQuery('projects', {
        filters: '$base_filter',
        pagination: { page: 1, per_page: 50 }
      }, 'data')
    )
  .endConditional()
  
  .conditional('$input.resource == "invoices"')
    .then(e => e
      .dbQuery('invoices', {
        filters: '$base_filter|set:"status":"unpaid"',
        sort: { field: 'due_date', direction: 'asc' }
      }, 'data')
    )
  .endConditional()
  
  .response({
    tenant_id: '$user_tenant.tenant_id',
    resource: '$input.resource',
    data: '$data'
  });

return endpoint.build().script;
```

### Event Sourcing Pattern
```javascript
const endpoint = create('update-inventory', 'POST')
  .requiresAuth('👤 users')
  .input('product_id', 'int', { required: true })
  .input('quantity_change', 'int', { required: true })
  .input('reason', 'text', { required: true })
  
  // Get current inventory
  .dbGet('inventory', { product_id: '$input.product_id' }, 'inventory')
  .precondition('$inventory != null', 'Product not found')
  
  // Calculate new quantity
  .var('new_quantity', '$inventory.quantity + $input.quantity_change')
  .precondition('$new_quantity >= 0', 'Insufficient inventory')
  
  // Create event record
  .dbAdd('inventory_events', {
    product_id: '$input.product_id',
    event_type: '$input.quantity_change > 0 ? "addition" : "removal"',
    quantity_change: '$input.quantity_change',
    quantity_before: '$inventory.quantity',
    quantity_after: '$new_quantity',
    reason: '$input.reason',
    user_id: '$auth.id',
    created_at: 'now'
  }, 'event')
  
  // Update inventory
  .dbEdit('inventory',
    { product_id: '$input.product_id' },
    {
      quantity: '$new_quantity',
      last_updated: 'now',
      last_event_id: '$event.id'
    },
    'updated_inventory'
  )
  
  // Check for low stock alert
  .conditional('$new_quantity < $inventory.reorder_point')
    .then(e => e
      // Create alert
      .dbAdd('alerts', {
        type: 'low_stock',
        product_id: '$input.product_id',
        message: '"Low stock: "|concat:$new_quantity|concat:" units remaining"',
        created_at: 'now'
      }, 'alert')
    )
  .endConditional()
  
  .response({
    success: true,
    inventory: buildObject({
      product_id: '$updated_inventory.product_id',
      quantity: '$updated_inventory.quantity',
      change: '$input.quantity_change'
    }),
    event_id: '$event.id'
  });

return endpoint.build().script;
```

## Performance Optimization

### Batch Processing Large Datasets
```javascript
const endpoint = create('process-large-dataset', 'POST')
  .requiresAuth('👤 users')
  .precondition('$auth.role == "admin"', 'Admin access required')
  
  // Configuration
  .var('batch_size', 100)
  .var('processed', 0)
  .var('errors', 0)
  .var('total', 0)
  
  // Get total count
  .dbCount('unprocessed_records', {}, 'total')
  
  // Process in batches
  .while('$processed < $total')
    // Get batch
    .dbQuery('unprocessed_records', {
      filters: {},
      limit: '$batch_size',
      offset: '$processed'
    }, 'batch')
    
    // Process each record in batch
    .forEach('$batch', 'record')
      // Simulate processing
      .var('process_result', buildObject({
        success: '$record.data != null',
        processed_at: 'now'
      }))
      
      // Update record
      .dbEdit('unprocessed_records',
        { id: '$record.id' },
        {
          processed: true,
          result: '$process_result',
          processed_at: 'now'
        },
        'updated'
      )
      
      // Track errors
      .conditional('$process_result.success == false')
        .then(e => e.varUpdate('errors', '$errors + 1'))
      .endConditional()
    .endForEach()
    
    // Update progress
    .varUpdate('processed', '$processed + $batch|count')
    
    // Prevent timeout - pause between batches
    .utilSleep(0.1)
  .endWhile()
  
  // Log completion
  .dbAdd('batch_logs', {
    operation: 'process_large_dataset',
    total_records: '$total',
    processed: '$processed',
    errors: '$errors',
    completed_at: 'now',
    user_id: '$auth.id'
  }, 'log')
  
  .response({
    success: true,
    processed: '$processed',
    errors: '$errors',
    total: '$total',
    batch_id: '$log.id'
  });

return endpoint.build().script;
```

### Efficient Filtering with Single Pass
```javascript
const endpoint = create('advanced-search', 'POST')
  .input('filters', 'object', { required: true })
  
  // Build complex filter expression
  .var('filter_expression', '""')
  
  // Name filter
  .conditional('$input.filters.name != null')
    .then(e => e
      .var('filter_expression', 
        '$filter_expression|concat:"$item.name|lowercase|contains:\\""|concat:$input.filters.name|lowercase|concat:\\""')
    )
  .endConditional()
  
  // Price range
  .conditional('$input.filters.min_price != null || $input.filters.max_price != null')
    .then(e => e
      .conditional('$filter_expression != ""')
        .then(e => e.varUpdate('filter_expression', '$filter_expression|concat:" && "'))
      .endConditional()
      
      .conditional('$input.filters.min_price != null')
        .then(e => e
          .varUpdate('filter_expression', 
            '$filter_expression|concat:"$item.price >= "|concat:$input.filters.min_price')
        )
      .endConditional()
      
      .conditional('$input.filters.max_price != null')
        .then(e => e
          .conditional('$input.filters.min_price != null')
            .then(e => e.varUpdate('filter_expression', '$filter_expression|concat:" && "'))
          .endConditional()
          .varUpdate('filter_expression', 
            '$filter_expression|concat:"$item.price <= "|concat:$input.filters.max_price')
        )
      .endConditional()
    )
  .endConditional()
  
  // Category filter
  .conditional('$input.filters.categories != null && $input.filters.categories|count > 0')
    .then(e => e
      .conditional('$filter_expression != ""')
        .then(e => e.varUpdate('filter_expression', '$filter_expression|concat:" && "'))
      .endConditional()
      .varUpdate('filter_expression', 
        '$filter_expression|concat:"$input.filters.categories|contains:$item.category"')
    )
  .endConditional()
  
  // Get all items and filter in single pass
  .dbQuery('products', {}, 'all_products')
  .var('filtered', '$all_products|filter:$filter_expression')
  
  .response({
    results: '$filtered',
    count: '$filtered|count',
    filter_applied: '$filter_expression'
  });

return endpoint.build().script;
```

## Best Practices Summary

1. **Always validate inputs** - Use preconditions for critical validations
2. **Handle errors gracefully** - Check for null values and API failures
3. **Use caching strategically** - Cache expensive operations, invalidate on updates
4. **Batch large operations** - Process in chunks to avoid timeouts
5. **Build complex objects with buildObject()** - Don't use literal objects for dynamic data
6. **Use transactions for consistency** - Group related database operations
7. **Log important operations** - Create audit trails for debugging
8. **Implement rate limiting** - Protect endpoints from abuse
9. **Test incrementally** - Build and test complex endpoints step by step
10. **Review generated XanoScript** - Always check the preview before deployment