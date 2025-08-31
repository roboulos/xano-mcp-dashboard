# Product Requirements Document: Three-Tier Pricing Implementation
## xano-mcp-dashboard

### Executive Summary
Transform the current pricing structure into a clear three-tier model that enables monetization while maintaining a free entry point for users to experience the product value.

### Objectives
1. Implement clear pricing tiers: Free, Pro ($199/month), Team (custom)
2. Enable feature gating based on subscription tier
3. Create smooth upgrade paths between tiers
4. Maintain existing user satisfaction during transition

### Current State
- **Problem**: Multiple conflicting pricing components with no actual payment integration
- **User Flow**: Sign up → Full access (no payment required)
- **Technical Debt**: Hardcoded limits, no subscription management

### Proposed Solution

#### Tier Structure

| Feature | Free | Pro ($199/mo) | Team |
|---------|------|---------------|------|
| Dashboard Access | ✅ Read-only | ✅ Full access | ✅ Full access |
| MCP Configurations | 1 | Unlimited | Unlimited |
| Documentation | ✅ | ✅ | ✅ |
| Community Support | ✅ | ✅ | ✅ |
| Weekly Strategy Calls | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |
| Team Management | ❌ | ❌ | ✅ |
| Custom Onboarding | ❌ | ❌ | ✅ |
| Price | $0 | $199/month | Contact Sales |

### Implementation Phases

#### Phase 1: Foundation (Priority 1 - This Week)
1. **Update Pricing Page Copy**
   - Remove conflicting pricing components
   - Create single source of truth with 3 tiers
   - Add clear value propositions for each tier

2. **Implement User Tiers in Xano**
   ```
   User table additions:
   - subscription_tier (enum: free, pro, team)
   - subscription_status (enum: active, inactive, trial)
   - subscription_started_at (timestamp)
   ```

3. **Add Feature Gating**
   - Create tier checking utility
   - Apply read-only mode to free tier
   - Limit MCP configs to 1 for free users

#### Phase 2: Pro Tier (Priority 2 - Next Sprint)
1. **Stripe Integration**
   - Create checkout session for Pro tier
   - Implement webhook handlers
   - Add subscription management

2. **Upgrade Flow**
   - Add "Upgrade to Pro" CTAs throughout free experience
   - Create upgrade success page
   - Send welcome email for new Pro users

#### Phase 3: Team Tier (Priority 3 - Future)
1. **Contact Sales Flow**
   - Create interest form
   - Capture team requirements
   - Manual onboarding process

2. **Team Features** (if resources allow)
   - Organization creation
   - Member invitations
   - Role management

### Success Metrics
- **Week 1**: 100% of new users on free tier
- **Month 1**: 10% free → pro conversion
- **Month 3**: $10K MRR
- **Month 6**: 5 team accounts

### User Stories

**Free User**
- As a new user, I want to try the dashboard risk-free
- As a free user, I want to understand what I'm missing
- As a free user, I want an easy path to upgrade

**Pro User**
- As a pro user, I want full access to all features
- As a pro user, I want to manage my subscription
- As a pro user, I want priority support

**Team User**
- As a team lead, I want custom pricing for my team
- As a team lead, I want to manage team members
- As a team lead, I want dedicated onboarding

### Technical Requirements

#### Frontend Changes
1. Update `/src/components/pricing.tsx` with new tiers
2. Create `/src/hooks/use-subscription.ts` for tier checking
3. Add upgrade prompts to dashboard
4. Implement read-only mode for free tier

#### Backend Changes (Xano)
1. Update user schema with subscription fields
2. Create subscription management endpoints
3. Add tier-based authorization checks
4. Create audit trail for upgrades

#### Integration Points
1. Stripe webhook endpoint (`/api/stripe/webhook`)
2. Subscription status sync with Xano
3. Feature flag system based on tier

### Migration Plan
1. **Existing Users**: Grandfather into Pro tier for 90 days
2. **Communication**: Email announcement with benefits
3. **Grace Period**: No immediate changes for 30 days
4. **Support**: FAQ and upgrade guide

### Risks & Mitigation
- **Risk**: User backlash from adding payment
  - **Mitigation**: Generous free tier, grandfather existing users
- **Risk**: Technical complexity of Stripe integration
  - **Mitigation**: Start with manual upgrade process
- **Risk**: Free tier abuse
  - **Mitigation**: Rate limiting, account verification

### Launch Checklist
- [ ] Update all pricing references site-wide
- [ ] Test free tier limitations
- [ ] Create upgrade flow documentation
- [ ] Prepare customer support scripts
- [ ] Set up monitoring for conversions
- [ ] Create rollback plan

### Next Steps
1. Approve tier structure and pricing
2. Begin Phase 1 implementation
3. Create marketing materials for launch
4. Schedule team training on new model