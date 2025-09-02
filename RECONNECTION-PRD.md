# RECONNECTION-PRD: Xano MCP Dashboard Credential Management

## Problem Statement

The `MCPConfigurations` component contains fully functional credential management logic but is not rendered anywhere in the UI after a redesign. There's a placeholder `XanoCredentialsForm` at `/dashboard/settings/universe-credentials` that doesn't connect to the backend. This PRD outlines the minimal changes needed to reconnect the existing functionality.

## Current State

### Working Components
- ✅ `MCPConfigurations` component with all CRUD operations
- ✅ All supporting components (Card, Form, DeleteDialog, EmptyState, Skeleton)
- ✅ API routes (`/api/mcp/credentials/*`) 
- ✅ Backend endpoints in Xano workspace 5
- ✅ Mapper utilities for data transformation
- ✅ Type definitions

### Issues
- ❌ MCPConfigurations not rendered anywhere
- ❌ No navigation link to universe-credentials page
- ❌ Placeholder form doesn't work

## Solution: Minimal Reconnection

### 1. Add Navigation Link

**File:** `/src/app/dashboard/settings/layout.tsx`

**Change:** Add navigation item to `sidebarNavItems` array

```tsx
import {
  IconApps,
  IconChecklist,
  IconCoin,
  IconUser,
  IconKey, // ADD THIS IMPORT
} from '@tabler/icons-react';

const sidebarNavItems = [
  // ... existing items ...
  {
    title: 'Xano Credentials',
    icon: <IconKey />,
    href: '/dashboard/settings/universe-credentials',
  },
].filter(Boolean);
```

### 2. Replace Placeholder with Working Component

**File:** `/src/app/dashboard/settings/universe-credentials/page.tsx`

**Change:** Replace XanoCredentialsForm with MCPConfigurations

```tsx
import { MCPConfigurations } from '@/components/dashboard/mcp-configurations';
import ContentSection from '../components/content-section';

export default function XanoCredentialsPage() {
  return (
    <ContentSection
      title="Xano Workspace Credentials"
      desc="Configure your Xano workspace connection settings."
    >
      <MCPConfigurations />
    </ContentSection>
  );
}
```

## Architecture Notes

### Authentication
- Component uses `localStorage.getItem('authToken')` which matches app pattern
- All dashboard routes are protected by AuthGuard
- API routes expect `Bearer ${authToken}` headers

### Providers
Already available from parent layouts:
- ✅ AuthProvider (root + dashboard)
- ✅ ThemeProvider
- ✅ TooltipProvider
- ✅ Toaster
- ✅ SearchProvider
- ✅ SidebarProvider

### Layout Integration
- Settings pages use `ContentSection` wrapper
- Content area has `flex-1 pb-8` container
- No additional styling needed - component is self-contained

## Testing Checklist

### 1. Navigation
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `/dashboard/settings`
- [ ] Verify "Xano Credentials" link appears in sidebar with key icon
- [ ] Click link navigates to `/dashboard/settings/universe-credentials`

### 2. Component Rendering
- [ ] MCPConfigurations component renders with correct title
- [ ] Empty state shows if no configurations
- [ ] "Add Configuration" button is visible

### 3. CRUD Operations
- [ ] **Create:** Add new configuration
  - Fill form with test credentials
  - Save successfully
  - Auto-validation runs
- [ ] **Read:** List shows saved configurations
  - Status indicators work (connected/error)
  - Preview data displays correctly
- [ ] **Update:** Edit existing configuration
  - Form pre-populates with current data
  - Changes save successfully
- [ ] **Delete:** Remove configuration
  - Confirmation dialog appears
  - Deletion completes

### 4. API Integration
- [ ] Network tab shows calls to `/api/mcp/credentials`
- [ ] Auth headers include Bearer token
- [ ] Responses handled correctly
- [ ] Error toasts appear for failures

### 5. Special Features
- [ ] Test Connection button validates credentials
- [ ] Set Active/Default functionality works
- [ ] Multiple configurations can be managed
- [ ] Auto-validation runs on page load

## Implementation Notes

### No Additional Changes Needed
- All components exist in `/src/components/dashboard/`
- API routes are functional
- Type definitions and mappers are in place
- No new dependencies required

### Optional Future Enhancement
- Consider refactoring to use `useAuth()` hook instead of direct localStorage access for better consistency with auth-context pattern

## Rollback Plan
If issues arise, simply revert the two file changes:
1. Remove navigation item from `settings/layout.tsx`
2. Restore `XanoCredentialsForm` import in `universe-credentials/page.tsx`

## Success Criteria
- Users can navigate to and see the Xano Credentials page
- All existing credential management functionality works
- No console errors or broken API calls
- Seamless integration with existing UI/UX patterns