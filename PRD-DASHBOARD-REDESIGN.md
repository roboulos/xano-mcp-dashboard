# Product Requirements Document: MCP Dashboard Redesign

## Executive Summary

The current MCP Control Center dashboard focuses on irrelevant infrastructure metrics and lacks the core functionality users need to manage their MCP server effectively. This redesign prioritizes user workflows around team management, API key administration, and connection configuration while eliminating noise from unimportant metrics.

## Problem Statement

### Current Issues
1. **Misaligned Metrics**: Prime real estate is occupied by irrelevant metrics (Response Time: 127ms, SLA: 99.9%, Uptime: 5d) that provide no actionable value for MCP server users
2. **Poor Information Architecture**: Critical actions are buried in small sidebar cards while meaningless stats dominate the main content area
3. **Missing Core Functionality**: No streamlined way to:
   - Generate MCP connection configs for different tools
   - Manage API keys with descriptions and team assignments
   - Invite and track team member activity
   - Access relevant usage analytics

### User Pain Points
- Users can't quickly get connection configs for Claude Desktop, Cursor, or Claude Code
- No easy way to see which team members are active and when they last made requests
- API key management is non-existent - no descriptions, assignments, or usage tracking
- Activity feed lacks context and actionability

## Success Metrics

### Primary KPIs
- **Time to Connect**: Reduce time to set up MCP connection from 5+ minutes to <30 seconds
- **Team Onboarding**: Reduce time to invite and configure new team member from 10+ minutes to <2 minutes
- **API Key Management**: Enable 100% of API keys to have descriptions and team assignments
- **Dashboard Engagement**: Increase time spent on dashboard by 3x due to relevant information

### Secondary Metrics
- Reduction in support tickets related to setup and configuration
- Increased team member adoption rate
- Higher API usage per team due to easier management

## Target Users

### Primary: Technical Team Leads
- **Needs**: Invite team members, manage access, monitor usage
- **Pain**: Current dashboard doesn't support team management workflows
- **Goal**: Efficiently onboard and manage development team access

### Secondary: Individual Developers  
- **Needs**: Quick connection setup, personal API key management
- **Pain**: Complex setup process for different development tools
- **Goal**: Fast integration with preferred development environment

## Proposed Solution

### New Dashboard Layout

#### Above the Fold (Priority 1)
1. **MCP Connection Hub** - Prominent card with one-click config generation
2. **Team Management Center** - Enhanced team section with invite workflow
3. **API Key Manager** - New comprehensive key management system

#### Below the Fold (Priority 2) 
4. **Usage Analytics** - Relevant metrics focused on API calls by user/key
5. **Activity Context** - Meaningful activity feed with actionable information

## Detailed Requirements

### 1. MCP Connection Hub
**Location**: Top-left, replacing current Service Infrastructure card

#### Features
- **One-Click Configuration Generation** for:
  - Claude Desktop (`.claude_desktop_config.json` format)
  - Claude Code (`mcp add` command)
  - Cursor (extension configuration)
  - Generic MCP server URL with authentication

#### User Stories
- As a developer, I want to copy my MCP connection config in one click so I can quickly set up my development environment
- As a team lead, I want to share standardized connection configs so my team uses consistent settings

#### Technical Requirements
- Generate config files with correct server URL and authentication
- Copy-to-clipboard functionality with visual feedback
- Support for environment-specific configs (dev/staging/prod)
- Downloadable config files for offline setup

### 2. Enhanced Team Management
**Location**: Center-left, expanding current Team Members section

#### Features
- **Prominent Invite Button** - Primary CTA for adding team members
- **Last Activity Tracking** - Show last API call timestamp per user
- **Role-Based Access** - Assign permissions per team member
- **Bulk Operations** - Multi-select for status changes

#### User Stories
- As a team lead, I want to quickly see who is actively using the MCP server
- As an admin, I want to invite multiple team members at once
- As a user, I want to see my own usage statistics

#### Technical Requirements
- Real-time activity updates
- Email invitation system with onboarding flow
- Permission matrix (admin, developer, viewer)
- Activity history per user (last 30 days)

### 3. API Key Management System
**Location**: New section, top-right area

#### Features
- **Key Creation with Metadata**:
  - Required description field
  - Optional team member assignment
  - Expiration date setting
  - Usage scope selection

- **Key Organization**:
  - Filter by assigned user
  - Sort by creation date, last used, usage count
  - Search by description
  - Bulk actions (disable, delete, extend)

#### User Stories
- As a team lead, I want to create API keys with clear descriptions so I know what each key is used for
- As a developer, I want to see which keys are assigned to me
- As an admin, I want to disable unused keys to maintain security

#### Technical Requirements
- Key metadata storage and indexing
- Usage analytics per key
- Automatic expiration handling
- Secure key display (masked by default)

### 4. Contextual Usage Analytics
**Location**: Right sidebar, replacing current Quick Actions

#### Features
- **User-Centric Metrics**:
  - API calls by team member (24h, 7d, 30d views)
  - Most active endpoints per user
  - Peak usage times
  - Error rates by user/key

- **Interactive Charts**:
  - Clickable user segments
  - Drill-down to specific API calls
  - Export capabilities

#### User Stories
- As a team lead, I want to see which team members are most active
- As a developer, I want to understand my own usage patterns
- As an admin, I want to identify optimization opportunities

#### Technical Requirements
- Real-time data aggregation
- Historical data retention (90 days minimum)
- Export to CSV/JSON
- Performance-optimized queries

### 5. Actionable Activity Feed
**Location**: Bottom section, replacing current Activity Monitor

#### Features
- **Enhanced Context**:
  - User-friendly descriptions ("Sarah created 15 database records" vs "POST /api/records")
  - Action outcomes (success/failure with reasons)
  - Related resource links
  - Grouping of related activities

- **Smart Filtering**:
  - Filter by team member
  - Filter by activity type
  - Time range selection
  - Error-only view

#### User Stories
- As a team lead, I want to understand what my team is building
- As a developer, I want to see the impact of my API calls
- As an admin, I want to quickly identify and resolve errors

#### Technical Requirements
- Activity categorization and enrichment
- Real-time updates with WebSocket connection
- Infinite scroll with pagination
- Activity detail modal views

## Removed/Deprecated Features

### Eliminated Metrics
- **Response Time**: Not actionable for MCP servers
- **SLA Percentage**: Irrelevant for development tools  
- **Uptime Counter**: Available elsewhere if needed
- **System Warnings**: Move to separate monitoring section

### Rationale
These metrics consume valuable screen space without providing actionable insights for MCP server users. Infrastructure metrics belong in dedicated monitoring tools, not user-facing dashboards.

## Implementation Phases

### Phase 1: Foundation & Theme Setup (Week 1)
**Theme & Component Installation**:
```bash
# Install Claude theme
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/claude.json

# Install core dashboard blocks
npx shadcn@latest add @shadcn/dashboard-01 -y
npx shadcn@latest add @shadcn/sidebar-07 -y
npx shadcn@latest add card button input badge avatar switch -y
```

**Core Infrastructure**:
- MCP Connection Hub using adapted `@shadcn/dashboard-01` section cards
- Basic shadcn theming implementation with light/dark mode support
- Component architecture using shadcn blocks as foundation

### Phase 2: User Management & API Keys (Week 2-3)  
**Component Integration**:
```bash
# Team management components
npx shadcn@latest add @shadcn/data-table -y
npx shadcn@latest add dialog sheet select -y

# Form components for key management
npx shadcn@latest add @shadcn/form -y
npx shadcn@latest add textarea label -y
```

**Features**:
- Enhanced team invitation flow using shadcn dialog/sheet components
- API key management interface with shadcn data-table
- User activity tracking with clean card layouts

### Phase 3: Analytics & Optimization (Week 4-5)
**Analytics Components**:
```bash
# Chart components for usage metrics
npx shadcn@latest add @shadcn/chart-area-default -y
npx shadcn@latest add @shadcn/chart-bar-default -y
npx shadcn@latest add @shadcn/chart-pie-legend -y
```

**Polish**:
- Usage analytics using shadcn chart components
- Contextual activity feed with consistent theming
- Performance optimizations and responsive design
- Comprehensive testing across light/dark themes

## Technical Implementation Strategy

### ShadCN Blocks Integration

#### CLI-Based Component Installation
All dashboard components will be implemented using the shadcn CLI for consistency and maintainability:

```bash
# Core dashboard blocks
npx shadcn@latest add @shadcn/dashboard-01 -y
npx shadcn@latest add @shadcn/sidebar-07 -y

# Chart components for analytics
npx shadcn@latest add @shadcn/chart-area-default -y
npx shadcn@latest add @shadcn/chart-bar-default -y

# Data display components
npx shadcn@latest add @shadcn/data-table -y
npx shadcn@latest add @shadcn/stats-card -y

# Team management components
npx shadcn@latest add @shadcn/avatar -y
npx shadcn@latest add @shadcn/badge -y
npx shadcn@latest add @shadcn/switch -y

# Form and interaction components
npx shadcn@latest add @shadcn/button -y
npx shadcn@latest add @shadcn/input -y
npx shadcn@latest add @shadcn/select -y
npx shadcn@latest add @shadcn/dialog -y
npx shadcn@latest add @shadcn/sheet -y
```

#### Component Architecture
- **Reusable Blocks**: Leverage existing shadcn dashboard blocks as foundation
- **Custom Adaptations**: Modify block components to fit MCP-specific data structures
- **Consistent APIs**: Maintain shadcn component prop conventions
- **Progressive Enhancement**: Build from basic blocks to complex dashboard views

#### ShadCN Block Mapping
**Current → New Implementation**:

1. **Service Infrastructure Card** → **MCP Connection Hub**
   - Base: `@shadcn/dashboard-01` section cards
   - Components: `Card`, `Button`, `Badge`, `Tabs`
   - Features: One-click config generation, environment switching

2. **Team Members Section** → **Enhanced Team Management**  
   - Base: `@shadcn/data-table` for user list
   - Components: `Avatar`, `Badge`, `Switch`, `Dialog`, `Sheet`
   - Features: Invitation flow, role management, activity tracking

3. **Quick Actions Sidebar** → **API Key Manager**
   - Base: Custom card layout using `@shadcn/form`
   - Components: `Input`, `Textarea`, `Select`, `Button`
   - Features: Key creation, assignment, usage tracking

4. **Activity Monitor** → **Contextual Analytics**
   - Base: `@shadcn/chart-area-default` and `@shadcn/chart-bar-default`
   - Components: Chart blocks, `Card`, `Tabs` for filtering
   - Features: User-focused metrics, interactive drilling

5. **Current Stats Cards** → **Relevant Usage Metrics**
   - Base: Adapted stats cards from `@shadcn/dashboard-01`
   - Components: `Card`, trend indicators, responsive design
   - Features: API calls by user, endpoint popularity, error rates

### Design System Implementation

#### Claude Theme Integration
The dashboard will use the Claude theme from TweakCN for a cohesive, professional aesthetic:

```bash
# Install Claude theme
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/claude.json
```

**Theme Characteristics**:
- **Color Space**: OKLCH for perceptually uniform colors
- **Design Philosophy**: Soft, muted palette with subtle contrast
- **Typography**: System font stack with consistent spacing
- **Border Radius**: Consistent 0.5rem throughout

#### CSS Variables Configuration
Update `components.json` to ensure CSS variables are enabled:

```json
{
  "tailwind": {
    "cssVariables": true,
    "baseColor": "neutral"
  }
}
```

#### Color Palette (Light & Dark Mode)
**Light Mode**:
- Primary: Soft neutrals with subtle warmth
- Background: Clean whites with minimal tinting
- Accent: Muted blues and greens for positive actions
- Error: Subtle reds for destructive actions

**Dark Mode**:
- Primary: Deeper tones with maintained readability
- Background: Rich darks without pure black
- Accent: Enhanced contrast while preserving hierarchy
- Charts: Vibrant colors optimized for dark backgrounds

### Component Styling Standards

#### Consistent Visual Language
- **Cards**: `bg-card` with subtle shadows and rounded corners
- **Interactive Elements**: Clear hover states using `hover:bg-accent`
- **Typography**: Semantic sizing with `text-foreground` and `text-muted-foreground`
- **Spacing**: Consistent padding using Tailwind's scale
- **Borders**: Subtle `border-border` for visual separation

#### State Management
- **Loading States**: Skeleton components matching theme aesthetic
- **Empty States**: Consistent messaging and call-to-action styling
- **Error States**: Clear error boundaries with theme-appropriate colors

### Performance Requirements
- Dashboard load time <2 seconds
- Real-time updates without page refresh
- Responsive design for mobile access
- Graceful degradation for slow connections

### Security Requirements
- API keys masked by default, reveal on user action
- Activity logging for all administrative actions
- Role-based access control enforcement
- Secure config generation without exposing secrets

### Integration Requirements
- Compatible with existing authentication system
- Maintain current API structure where possible
- Support for future MCP protocol updates
- Integration with external analytics tools

## Success Criteria

### User Acceptance
- 95% of users can generate connection config within 30 seconds
- 90% of team invitations result in successful onboarding
- 100% of API keys have meaningful descriptions
- 80% reduction in setup-related support requests

### Performance
- Dashboard loads in <2 seconds on 3G connection
- Real-time updates delivered within 1 second
- Support for teams up to 100 members without performance degradation

### Business Impact
- 50% increase in team size per organization
- 40% increase in API usage per team member
- 60% reduction in time-to-productivity for new team members

## Risk Mitigation

### Technical Risks
- **Risk**: Performance degradation with real-time updates
- **Mitigation**: Implement efficient WebSocket handling and data pagination

- **Risk**: Complex config generation for different tools
- **Mitigation**: Create template system with comprehensive testing

### User Experience Risks  
- **Risk**: Overwhelming interface with too many features
- **Mitigation**: Progressive disclosure and user testing

- **Risk**: Migration issues from current dashboard
- **Mitigation**: Gradual rollout with feature flags

## Appendix

### Current vs. Proposed Layout Comparison

#### Current Layout Issues
- Service Infrastructure (40% of space) - Low value metrics
- Quick Actions (15% of space) - Disconnected from user goals  
- Team Members (30% of space) - Good but could be enhanced
- Activity Monitor (15% of space) - Noise without context

#### Proposed Layout Benefits
- MCP Connection Hub (25% of space) - High-value, immediate utility
- Team Management (35% of space) - Enhanced core functionality
- API Key Manager (25% of space) - New critical feature
- Contextual Analytics (15% of space) - Relevant, actionable data

This redesign transforms the dashboard from a metrics display into a productivity tool that directly supports user workflows and team collaboration.