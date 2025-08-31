# Xano MCP Tutorials

Welcome to the Xano MCP tutorials! These step-by-step guides will help you master backend development with practical, real-world examples.

## Getting Started

### [Quick Start Guide](./getting-started.md)
Build your first API endpoint in 5 minutes and understand the basics of Xano MCP.

### [Features Overview](./features-overview.md)
Explore all the capabilities of Xano MCP and what you can build with it.

## Core Tutorials

### Building a CRUD API

Learn how to create a complete Create, Read, Update, Delete API for any resource.

**What you'll build:**
- RESTful endpoints for managing data
- Search and filtering capabilities
- Pagination for large datasets
- Sorting and field selection
- Input validation and error handling

**Example: Product Catalog API**
```javascript
// Create complete CRUD system with one command
await xanoMCP.createCrudSystem({
  table: 'products',
  features: {
    search: true,
    filters: ['category', 'price_range', 'in_stock'],
    sorting: ['name', 'price', 'created_at'],
    pagination: { defaultSize: 20, maxSize: 100 }
  },
  auth: {
    list: false,      // Public listing
    get: false,       // Public viewing
    create: true,     // Auth required
    update: true,     // Auth required
    delete: 'admin'   // Admin only
  }
});
```

### Adding Authentication

Implement a secure user authentication system with registration, login, and session management.

**What you'll build:**
- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- Session management
- Social login integration

**Key concepts covered:**
- Password hashing and security
- JWT token generation and validation
- Email verification workflow
- Protecting endpoints with authentication
- Role-based access control

### Stripe Integration

Accept payments and manage subscriptions with Stripe.

**What you'll build:**
- Checkout session creation
- Webhook handling for payment events
- Subscription management
- Customer portal integration
- Refund processing

**Example implementation:**
```javascript
const endpoint = create('create-checkout', 'POST')
  .requiresAuth('users')
  .input('price_id', 'text', { required: true })
  
  .createStripeCheckout({
    customer_email: '$auth.email',
    price_id: '$input.price_id',
    success_url: 'https://myapp.com/success',
    cancel_url: 'https://myapp.com/cancel',
    metadata: {
      user_id: '$auth.id'
    }
  }, 'session')
  
  .response({
    checkout_url: '$session.url'
  });
```

### File Uploads

Handle file uploads with validation, processing, and storage.

**What you'll build:**
- Image upload with resizing
- Document storage system
- File validation and virus scanning
- Secure file access with signed URLs
- Bulk file operations

**Supported features:**
- Multiple file formats
- Size restrictions
- Image transformations
- CDN distribution
- Access control

### Real-World Examples

## E-Commerce Backend

Build a complete e-commerce API including:

**Database Schema:**
- Products with variants
- Categories and tags
- Shopping cart
- Orders and order items
- Customer profiles
- Reviews and ratings

**API Endpoints:**
- Product catalog with search
- Cart management
- Checkout process
- Order tracking
- Inventory management
- Customer wishlists

**Advanced Features:**
- Real-time inventory updates
- Abandoned cart recovery
- Recommendation engine
- Analytics dashboard

## SaaS Application

Create a multi-tenant SaaS backend with:

**Core Features:**
- Team/organization management
- User invitations and permissions
- Subscription billing with Stripe
- Usage tracking and limits
- API key management

**Example: Project Management SaaS**
```javascript
// Multi-tenant data isolation
const endpoint = create('projects/list', 'GET')
  .requiresAuth('users')
  
  // Get user's organization
  .dbGet('organization_members', {
    user_id: '$auth.id',
    active: true
  }, 'membership')
  
  // List projects for organization
  .dbQuery('projects', {
    filter: {
      organization_id: '$membership.organization_id'
    },
    sort: { updated_at: 'desc' }
  }, 'projects')
  
  .response({
    projects: '$projects.items',
    organization: '$membership.organization_name'
  });
```

## Social Media Platform

Build social features including:

**User Interactions:**
- Follow/unfollow system
- Posts with comments
- Like and reaction system
- Direct messaging
- Notifications

**Feed Algorithm:**
```javascript
// Generate personalized feed
const endpoint = create('feed', 'GET')
  .requiresAuth('users')
  
  // Get followed users
  .dbQuery('follows', {
    filter: { follower_id: '$auth.id' }
  }, 'following')
  
  .var('followedUserIds', '$following.items|pluck:"followed_id"')
  
  // Get recent posts from followed users
  .dbQuery('posts', {
    filter: {
      author_id: { $in: '$followedUserIds' },
      created_at: { $gte: '"now"|add_days:-7' }
    },
    sort: { engagement_score: 'desc' },
    limit: 50
  }, 'feedPosts')
  
  .response({
    posts: '$feedPosts.items'
  });
```

## IoT Data Collection

Handle IoT device data with:

**Features:**
- Device registration and authentication
- Time-series data storage
- Real-time data processing
- Alerting and thresholds
- Data aggregation and analytics

**Example: Temperature Monitoring**
```javascript
const endpoint = create('device/data', 'POST')
  .input('device_id', 'text', { required: true })
  .input('api_key', 'text', { required: true })
  .input('temperature', 'decimal', { required: true })
  .input('humidity', 'decimal')
  
  // Validate device
  .dbGet('devices', {
    device_id: '$input.device_id',
    api_key: '$input.api_key',
    active: true
  }, 'device')
  
  .precondition('$device != null', 'Invalid device credentials')
  
  // Store reading
  .dbAdd('readings', {
    device_id: '$device.id',
    temperature: '$input.temperature',
    humidity: '$input.humidity',
    timestamp: 'now'
  }, 'reading')
  
  // Check for alerts
  .conditional('$input.temperature > $device.max_temp_threshold')
    .then(e => e
      .sendAlert({
        type: 'temperature_high',
        device: '$device.name',
        value: '$input.temperature',
        threshold: '$device.max_temp_threshold'
      })
    )
  .endConditional()
  
  .response({ 
    status: 'recorded',
    reading_id: '$reading.id'
  });
```

## Advanced Patterns

### Webhook Processing

Learn to handle webhooks from various services:

- GitHub/GitLab webhooks for CI/CD
- Stripe payment webhooks
- SendGrid email events
- Twilio SMS callbacks
- Custom webhook validation

### External API Integration

Connect to third-party services:

- OpenAI for AI features
- SendGrid for emails
- Twilio for SMS
- Google Maps for geocoding
- Weather APIs
- Social media APIs

### Performance Optimization

Optimize your APIs for scale:

- Database indexing strategies
- Caching with Redis
- Query optimization
- Batch operations
- Pagination best practices

### Security Best Practices

Implement enterprise-grade security:

- Input validation and sanitization
- SQL injection prevention
- Rate limiting
- API key management
- Audit logging
- GDPR compliance

## Learning Path

### Beginner Path
1. Quick Start Guide
2. Building a CRUD API
3. Adding Authentication
4. File Uploads

### Intermediate Path
1. Stripe Integration
2. External API Integration
3. Webhook Processing
4. E-Commerce Backend

### Advanced Path
1. SaaS Application
2. Performance Optimization
3. Security Best Practices
4. IoT Data Collection

## Resources

### Code Examples
Find complete, working examples in our [GitHub repository](https://github.com/xano-mcp/examples).

### Video Tutorials
Watch step-by-step video guides on our [YouTube channel](https://youtube.com/xano-mcp).

### Community
- Join our [Discord server](https://discord.gg/xano-mcp) for help and discussions
- Browse [Stack Overflow](https://stackoverflow.com/questions/tagged/xano-mcp) for solutions
- Follow [@XanoMCP](https://twitter.com/xanomcp) for updates

### Support
- Check our [FAQ](./faq.md) for common questions
- Read the [Troubleshooting Guide](./troubleshooting-guide.md)
- Contact support at support@xano-mcp.com

Ready to start building? Pick a tutorial and dive in!