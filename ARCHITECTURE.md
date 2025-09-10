# Architecture Overview

## Simplified Direct Xano Integration

This dashboard uses a simplified architecture that eliminates unnecessary API route proxies, allowing components to communicate directly with Xano APIs.

### Key Components

#### 1. XanoClient Service (`/src/services/xano-client.ts`)
- Centralized client for all Xano API calls
- Handles authentication token management
- Organized by API groups:
  - `auth` - Authentication endpoints (login, signup, me)
  - `credentials` - Xano credentials management
  - `analytics` - Dashboard metrics and analytics
  - `billing` - Stripe billing and subscription management
  - `workspace` - Workspace member management

#### 2. Auth Storage (`/src/utils/auth-storage.ts`)
- Manages JWT token storage
- Supports both localStorage and cookies
- Provides consistent API for token management

#### 3. Direct API Communication
- Components use hooks that call XanoClient directly
- No intermediate Next.js API routes needed
- Xano handles all business logic and Stripe webhooks

### Authentication Flow

1. User logs in via `/login` page
2. XanoClient calls Xano auth endpoint directly
3. JWT token stored via authStorage utility
4. Auth context uses XanoClient to verify user
5. All subsequent API calls include auth token

### Benefits

1. **Simpler Architecture** - No duplicate API routes
2. **Better Performance** - Direct calls reduce latency
3. **Easier Maintenance** - Single source of truth (Xano)
4. **Full Xano Features** - Direct access to all Xano capabilities

### Xano API Groups

#### Xano Credentials Management (api:Etd0xY9r)
- Create, list, update, delete Xano API credentials
- Validate credentials
- Set default credential

#### Authentication Management (api:e6emygx3)
- User signup and login
- Get current user info
- Save API keys

#### Dashboard Analytics (api:ZVMx4ul_)
- Real-time MCP metrics
- Daily metrics and trends
- Performance analytics
- Activity feed
- Error tracking

#### Stripe & Billing Management (api:uBjgCRGU)
- Subscription plans and pricing
- Checkout session creation
- Payment method management
- Usage tracking and quotas
- Stripe webhook handling

### Removed Components

All Next.js API routes have been archived as they were simply proxying to Xano. The only routes you might consider keeping are:

1. **None required** - Xano handles everything including Stripe webhooks
2. **Optional**: Cookie-based session management if needed for SSR

### Migration Notes

- All API routes moved to `archived-api-routes/`
- To restore if needed: `mv archived-api-routes/api src/app/`
- Components updated to use XanoClient directly
- Auth context simplified to use direct Xano calls