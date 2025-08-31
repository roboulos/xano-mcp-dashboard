# Website Copy Update - Product Requirements Document (PRD)

## Executive Summary
This PRD outlines the strategy and implementation plan for updating the Xano MCP Dashboard website copy to be more direct, outcome-focused, and credible. The new messaging centers around "Build 10x faster in Xano" with supporting evidence from real user testimonials and proven results.

## Objective
Transform the website copy from feature-focused to outcome-focused messaging that:
- Immediately communicates the speed benefit (10x faster)
- Addresses the core pain point (AI that actually works with Xano)
- Uses real user stories and quotes for credibility
- Explains the technical differentiator clearly (TypeScript SDK + Middleware)

## Current State Analysis

### Strengths
- Already incorporates problem/solution framework
- Uses real user names and stories (Luke, Shane, Nick, West)
- Highlights technical differentiators
- Strong CTA and features sections

### Areas for Improvement
- Core speed benefit ("10x faster") not always explicit
- Some testimonials are sanitized vs. raw quotes
- Price-to-value connection could be stronger
- Technical explanation could be clearer

## Key Insights from Analysis

### User Evidence
- **Luke (UK)**: Built client platform "by the pool in Greece on my phone" - prefers AI to his developers
- **Shane (UK)**: "4 hours → 2 minutes" (120x improvement!) - created 1,500-line cookbook
- **Nick (Australia)**: From "too good to be true" skeptic to "front of something big" believer
- **West & John**: Healthcare team using in production after starting with read-only credentials

### Metrics & Results
- **80-90% first-try success rate** (Robert Boulos quote)
- **Built 50 endpoints during a barbecue** (productivity proof)
- **100+ MCP tools** ready to use
- **$300/hour** - Robert's consulting rate (value benchmark)

### Technical Differentiators
- **Problem**: XanoScript gives zero error feedback, AI generates "green expression soup"
- **Solution**: TypeScript SDK (guardrails) + Middleware (feedback loop)
- **Result**: AI uses Xano's 200+ filters correctly

## Specific Copy Changes

### 1. Hero Section (`hero.tsx`)

#### Headline (Line ~137-143)
**Current**: "The Framework for AI-Accelerated Development"
**New**: "Build 10x Faster in Xano with AI That Actually Works"
**Alternative**: "AI That Ships Working Xano Code in Minutes, Not Hours"

#### Subtitle (Line ~147-157)
**Current**: Generic benefits statement
**New**: 
```
"80-90% of the time, I click Run and it just works." - Robert Boulos
Stop debugging green expression soup. Build in 2 minutes what used to take 4 hours.
TypeScript SDK + middleware = AI that speaks fluent XanoScript.
```

#### Trust Indicators (Line ~160-173)
Update to match transcript evidence:
- ⚡ 100+ MCP tools ready
- 🎯 80-90% first-try success
- 📅 Weekly MCP Wednesday calls

### 2. Features Section (`features.tsx`)

#### Section Badge & Headline (Line ~13-18)
**Current**: Generic messaging
**New**: 
- Badge: "TypeScript SDK + Middleware"
- Headline: "Why This AI Doesn't Break Like The Others"

#### Tab Structure (Line ~26-36)
Replace with problem → solution → proof:
1. "❌ Why AI Fails in Xano"
2. "✅ How We Fixed It" 
3. "📈 Real Developer Stories"

#### Tab Content
Use exact language from transcripts:
- "green expression soup"
- "guardrails like bowling lane bumpers"
- "feedback loop with linting"

### 3. Testimonials Section

Replace ALL testimonials with exact quotes:

```javascript
const testimonials = [
  {
    quote: "I was in Greece last week by the pool... got everything working on my phone. I actually now prefer the AI version to one of my developers.",
    author: "Luke",
    role: "Platform Builder, UK",
    avatar: "/testimonials/luke.jpg"
  },
  {
    quote: "It created this function which probably would have taken me about four hours in two minutes.",
    author: "Shane", 
    role: "Developer, UK",
    avatar: "/testimonials/shane.jpg"
  },
  {
    quote: "This seemed too good to be true... I booked a call before entering my API key. We're at the front of something big here.",
    author: "Nick",
    role: "Automation Developer, Australia",
    avatar: "/testimonials/nick.jpg"
  },
  {
    quote: "We started with read-only credentials for our healthcare client. Now it's part of our production workflow.",
    author: "West",
    role: "Healthcare Tech Lead",
    avatar: "/testimonials/west.jpg"
  },
  {
    quote: "80-90% of the time, I click Run and it just works. This wasn't possible before the SDK and middleware.",
    author: "Robert Boulos",
    role: "Creator, Snappy MCP",
    avatar: "/testimonials/robert.jpg",
    featured: true
  }
];
```

### 4. Pricing Section

#### Headline
**Keep**: "Less Than One Hour of Debugging"

#### Subtitle
**New**: 
```
Robert's consulting rate: $300/hour. This tool costs less than that per month.
Join weekly MCP Wednesday calls. Ship endpoints that work. Stop debugging XanoScript.
```

#### Plan Descriptions
Add context to each tier:
- **Starter ($99)**: "Perfect for Luke's 'pool-side building' workflow"
- **Pro ($499)**: "What Shane uses for '4 hours → 2 minutes' builds"
- **Enterprise ($2k+)**: "West's healthcare-grade setup with priority support"

### 5. FAQ Section

Add new questions based on real concerns:

```javascript
const faqs = [
  {
    question: "Is this too good to be true?",
    answer: "Nick from Australia thought so too. He booked a demo call before trusting us with his API key. Now he says 'we're at the front of something big.' Start with read-only credentials if you want - that's what West's healthcare team did."
  },
  {
    question: "What makes this different from other AI tools?",
    answer: "TypeScript SDK with guardrails + middleware feedback loop. While other tools generate broken XanoScript with green expressions everywhere, ours uses Xano filters properly and gives the AI actual error feedback to fix issues. Result: '80-90% first-try success' (Robert)."
  },
  {
    question: "How fast is '10x faster'?",
    answer: "Shane measured it: 4 hours → 2 minutes. That's actually 120x faster. Robert built 50 endpoints during a barbecue. Luke builds complete platforms from his phone by the pool."
  },
  {
    question: "What are MCP Wednesday calls?",
    answer: "Weekly live sessions where Robert builds endpoints, answers questions, and shows new techniques. Luke, Shane, West, Ray Deck and others regularly attend. Real builds, real problems solved, real results."
  }
];
```

### 6. CTA Section

#### Headline
**New**: "Stop Debugging. Start Shipping."

#### Description
**New**: 
```
Join MCP Wednesday. See Robert build live. Watch the SDK + middleware 
turn "it failed" into "it works." Then build your own - with guardrails.
```

#### Button Text
**Primary**: "Get Access + Join Wednesday Call"
**Secondary**: "Watch 2-Minute Demo"

## Implementation Timeline

### Phase 1: High-Impact Changes (Week 1)
1. Update Hero headline and subtitle
2. Replace all testimonials with raw quotes
3. Update pricing subtitle with $300/hr comparison
4. Fix "82%" → "80-90%" everywhere
5. Change "Thursday" → "Wednesday" for calls

### Phase 2: Content Refinement (Week 2)
1. Rewrite Features section with problem/solution/proof structure
2. Add user context to pricing tiers
3. Update FAQ with real questions from transcripts
4. Add "Start with read-only" trust builders

### Phase 3: Strategic Additions (Weeks 3-4)
1. Create "How It Works" technical page
2. Build "User Stories" page with full case studies
3. Add "MCP Wednesday" as prominent feature
4. Create comparison: "Raw XanoScript vs. With Guardrails"

## Success Metrics

### Quantitative
- Conversion rate increase (signups/visitors)
- Time on page increase (Hero, Features, Pricing)
- Bounce rate decrease
- MCP Wednesday attendance growth

### Qualitative
- Decrease in "Is this real?" inquiries
- Increase in technical questions vs. skepticism
- More users starting with read-only credentials
- Users using our phrases: "AI that actually works", "guardrails"

## Copy Guidelines

### DO Use
- Direct quotes from transcripts
- Specific metrics (80-90%, 100+ tools, 4 hours → 2 minutes)
- Real names and locations (Luke/UK, Shane/UK, Nick/Australia)
- Technical accuracy (TypeScript SDK, middleware, XanoScript)
- Problem-first messaging

### DON'T Use
- Made-up metrics
- Generic claims ("revolutionary", "game-changing")
- Vague benefits ("transform your workflow")
- Corporate speak ("enterprise-grade", "best-in-class")
- Fake urgency ("12 spots left")

### Voice & Tone
- Developer-to-developer honesty
- Technical but accessible
- Skepticism-acknowledging ("seemed too good to be true")
- Results-focused ("it just works")
- Community-oriented (MCP Wednesday)

## Technical Messaging Framework

### The Problem (Why AI Fails)
1. **No Feedback**: XanoScript returns "failed" with zero details
2. **No Guardrails**: AI generates invalid syntax, green expressions
3. **No Context**: Can't use Xano's 200+ filters properly

### The Solution (How We Fixed It)
1. **TypeScript SDK**: "Guardrails like bowling lane bumpers"
2. **Middleware Layer**: Feedback loop with linting and corrections
3. **100+ MCP Tools**: Every Xano operation mapped and optimized

### The Result (What You Get)
1. **Speed**: "4 hours → 2 minutes" (Shane)
2. **Reliability**: "80-90% first-try success" (Robert)
3. **Trust**: "Prefer AI to my developers" (Luke)

## Next Steps
1. Review and approve this PRD
2. Implement Phase 1 changes immediately
3. Schedule weekly reviews during implementation
4. Collect user feedback after each phase
5. Iterate based on metrics and feedback

---

*This PRD is based on analysis of 5 transcripts (~1,000 minutes), technical documentation, and current website copy. All quotes and metrics are verified from source materials.*