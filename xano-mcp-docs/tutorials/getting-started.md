# Getting Started with Xano MCP

Welcome to Xano MCP! This guide will help you understand what Xano MCP is and how to build your first API endpoint in just 5 minutes.

## What is Xano MCP?

Xano MCP (Model Context Protocol) is a powerful toolkit that lets you build backend APIs using natural language and simple JavaScript-like code. Instead of manually configuring every aspect of your backend, you describe what you want, and Xano MCP handles the complex implementation details.

### Key Benefits

- **Lightning Fast Development**: Create complete API endpoints in minutes, not hours
- **Natural Language Interface**: Describe your needs in plain English
- **95% Less Code**: Write simple SDK code instead of complex XanoScript
- **Production Ready**: Generate the same quality code as expert Xano developers
- **AI-Powered**: Leverage AI assistance to build sophisticated backends

## Prerequisites

Before getting started, you'll need:

1. **A Xano Account**: Sign up for free at [xano.com](https://xano.com)
2. **Xano Instance**: Create a new workspace in your Xano dashboard
3. **API Key**: Generate an API key from your Xano instance settings
4. **Basic Web Knowledge**: Familiarity with APIs, JSON, and JavaScript

## Quick Start: Your First API in 5 Minutes

Let's build a simple "Hello World" API endpoint to see Xano MCP in action.

### Step 1: Understanding the SDK

Xano MCP provides a fluent SDK that lets you define endpoints using chainable methods:

```javascript
const endpoint = create('hello-world', 'GET')
  .input('name', 'text', { required: true })
  .var('greeting', '"Hello, " ~ $input.name ~ "!"')
  .response({ message: '$greeting' });

return endpoint.build().script;
```

This simple code creates a complete API endpoint that:
- Accepts a `name` parameter
- Creates a greeting message
- Returns it as JSON

### Step 2: Building a User Registration Endpoint

Let's create something more practical - a user registration endpoint:

```javascript
const endpoint = create('register', 'POST')
  .input('email', 'email', { required: true })
  .input('password', 'password', { required: true })
  .input('name', 'text', { required: true })
  
  // Check if user already exists
  .dbGet('users', { email: '$input.email' }, 'existingUser')
  .conditional('$existingUser != null')
    .then(e => e
      .response({ 
        error: 'User with this email already exists' 
      }, 400)
    )
  .endConditional()
  
  // Create new user
  .dbAdd('users', {
    email: '$input.email',
    password: '$input.password',
    name: '$input.name',
    created_at: 'now'
  }, 'newUser')
  
  // Generate auth token
  .createAuthToken('users', '$newUser.id', 'authToken')
  
  // Return success response
  .response({
    message: 'Registration successful',
    user: '$newUser',
    token: '$authToken'
  });

return endpoint.build().script;
```

### Step 3: Using High-Level Tools

For common patterns, Xano MCP provides even simpler tools:

```javascript
// Create a complete authentication system with one command
await xanoMCP.createAuthSystem({
  userTable: 'users',
  includeEmailVerification: true,
  sessionDuration: 86400 // 24 hours
});

// This creates:
// - /auth/register endpoint
// - /auth/login endpoint
// - /auth/logout endpoint
// - /auth/verify-email endpoint
// - /auth/forgot-password endpoint
// - /auth/reset-password endpoint
```

## Common Use Cases

### 1. CRUD Operations

Create a complete CRUD system for any table:

```javascript
await xanoMCP.createCrudSystem({
  table: 'products',
  features: {
    search: true,
    filters: true,
    pagination: true,
    sorting: true
  },
  auth: true // Require authentication
});

// This creates:
// GET /products (list with search/filter/sort)
// GET /products/{id} (get single product)
// POST /products (create new product)
// PUT /products/{id} (update product)
// DELETE /products/{id} (delete product)
```

### 2. File Uploads

Handle file uploads with ease:

```javascript
const endpoint = create('upload-avatar', 'POST')
  .requiresAuth('users')
  .input('avatar', 'image', { 
    required: true,
    maxSize: 5 // MB
  })
  
  .createImage('$input.avatar', '$auth.id + "-avatar.jpg"', 'imageData')
  
  .dbEdit('users', 
    { id: '$auth.id' }, 
    { avatar_url: '$imageData.url' }, 
    'updatedUser'
  )
  
  .response({
    message: 'Avatar uploaded successfully',
    url: '$imageData.url'
  });
```

### 3. External API Integration

Call external APIs and process results:

```javascript
const endpoint = create('weather', 'GET')
  .input('city', 'text', { required: true })
  
  .apiGet(
    '"https://api.weatherapi.com/v1/current.json?key=" ~ $env.WEATHER_API_KEY ~ "&q=" ~ $input.city',
    {},
    'weatherData'
  )
  
  .var('temperature', '$weatherData.current.temp_c')
  .var('condition', '$weatherData.current.condition.text')
  
  .response({
    city: '$input.city',
    temperature: '$temperature',
    condition: '$condition',
    unit: 'celsius'
  });
```

### 4. Scheduled Tasks

Create background jobs that run on a schedule:

```javascript
const task = createTask('daily-cleanup')
  .schedule('0 0 * * *') // Midnight every day
  
  // Delete old sessions
  .dbDelete('sessions', {
    expires_at: { $lt: 'now' }
  })
  
  // Clean up temporary files older than 7 days
  .var('cutoffDate', '"now"|add_days:-7')
  .dbDelete('temp_files', {
    created_at: { $lt: '$cutoffDate' }
  });
```

## Best Practices

### 1. Use Variables for Complex Logic

Instead of inline expressions, use variables for clarity:

```javascript
// Good
.var('fullName', '$input.firstName ~ " " ~ $input.lastName')
.var('welcomeMessage', '"Welcome, " ~ $fullName ~ "!"')

// Avoid
.response({ message: '"Welcome, " ~ $input.firstName ~ " " ~ $input.lastName ~ "!"' })
```

### 2. Handle Errors Gracefully

Always validate inputs and handle edge cases:

```javascript
.precondition('$input.age >= 18', 'Must be 18 or older')
.precondition('$input.email|contains:"@"', 'Invalid email format')
```

### 3. Use Authentication When Needed

Protect sensitive endpoints:

```javascript
.requiresAuth('users') // Requires valid user token
.precondition('$auth.role == "admin"', 'Admin access required')
```

### 4. Optimize Database Queries

Use proper indexing and filtering:

```javascript
.dbQuery('orders', {
  filter: { user_id: '$auth.id', status: 'active' },
  sort: { created_at: 'desc' },
  page: '$input.page',
  per_page: 20
}, 'orders')
```

## What Can You Build?

With Xano MCP, you can create:

- **SaaS Backends**: User management, subscriptions, multi-tenancy
- **E-commerce APIs**: Products, orders, payments, inventory
- **Social Platforms**: Posts, comments, likes, follows
- **IoT Services**: Device management, data collection, analytics
- **Mobile App Backends**: Push notifications, offline sync, real-time updates
- **Workflow Automation**: Webhooks, integrations, scheduled tasks

## Next Steps

Now that you've seen the basics, here's how to level up:

1. **Explore the SDK Reference**: Learn all available methods and filters
2. **Check out Tutorials**: Step-by-step guides for common scenarios
3. **Browse Templates**: Pre-built solutions you can customize
4. **Join the Community**: Get help and share your creations

Ready to build something amazing? Let's dive deeper into the features and capabilities of Xano MCP!

## Quick Reference

### Common SDK Methods

```javascript
// Database Operations
.dbQuery(table, options, alias)      // Query with filters
.dbGet(table, filter, alias)         // Get single record
.dbAdd(table, data, alias)           // Create record
.dbEdit(table, filter, data, alias)  // Update record
.dbDelete(table, filter)             // Delete records

// Variables & Logic
.var(name, value)                    // Create variable
.conditional(expression)             // If statement
.foreach(array, itemAlias)           // Loop through array

// Authentication
.requiresAuth(table)                 // Require authentication
.createAuthToken(table, id, alias)   // Generate JWT token

// Response
.response(data, statusCode)          // Return response
```

### Common Filters

```javascript
// String Operations
|to_lower    // Convert to lowercase
|to_upper    // Convert to uppercase
|trim        // Remove whitespace
|concat:text // Concatenate strings

// Number Operations
|add:n       // Addition
|multiply:n  // Multiplication
|round:n     // Round to n decimals

// Array Operations
|count       // Get array length
|first       // Get first element
|sort        // Sort array
|unique      // Remove duplicates
```

Happy building with Xano MCP! 🚀