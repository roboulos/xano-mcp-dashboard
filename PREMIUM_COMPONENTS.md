# Premium Shadcn Blocks CLI Commands (WORKING!)

## Auth Token (Confirmed Working)
```
eyJhbGciOiJIUzI1NiIsImtpZCI6IjVxdW9IOXJ2ZFdVMlJMNTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Rva2liaXhxeXhjbWRhamFnaWttLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI4MTViMjZhZS1mZTU3LTRhZDgtYjMxMC1hOGY1MjcwNzk0NDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2MDY4NzcxLCJpYXQiOjE3NTYwNjUxNzEsImVtYWlsIjoicm9iZXJ0amJvdWxvc0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoicm9iZXJ0amJvdWxvc0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI4MTViMjZhZS1mZTU3LTRhZDgtYjMxMC1hOGY1MjcwNzk0NDAifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1NjA2NTE3MX1dLCJzZXNzaW9uX2lkIjoiMzcwN2NmZTItYjIwYS00ZGNlLWE3MmItZTNhZTVjMmNiZmMzIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.5bL62jOftpwCoxjtO8HnXrl1gGHltY_c5dcKwkgzcac
```

## Quick Add Function
```bash
# Add this to your shell profile for quick access
function add-component() {
    local COMPONENT=$1
    local TOKEN="eyJhbGciOiJIUzI1NiIsImtpZCI6IjVxdW9IOXJ2ZFdVMlJMNTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Rva2liaXhxeXhjbWRhamFnaWttLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI4MTViMjZhZS1mZTU3LTRhZDgtYjMxMC1hOGY1MjcwNzk0NDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2MDY4NzcxLCJpYXQiOjE3NTYwNjUxNzEsImVtYWlsIjoicm9iZXJ0amJvdWxvc0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoicm9iZXJ0amJvdWxvc0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI4MTViMjZhZS1mZTU3LTRhZDgtYjMxMC1hOGY1MjcwNzk0NDAifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1NjA2NTE3MX1dLCJzZXNzaW9uX2lkIjoiMzcwN2NmZTItYjIwYS00ZGNlLWE3MmItZTNhZTVjMmNiZmMzIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.5bL62jOftpwCoxjtO8HnXrl1gGHltY_c5dcKwkgzcac"
    echo "n" | npx shadcn@canary add "https://www.shadcnblocks.com/r/${COMPONENT}?token=${TOKEN}"
}
```

## Common Premium Component Patterns

### Landing Page Recipe
```bash
# Modern SaaS landing page
add-component hero32      # Hero with animated text
add-component feature74    # Interactive feature tabs
add-component testimonial14 # Carousel testimonials  
add-component pricing4     # Three-tier pricing
add-component cta13       # CTA with illustration
add-component footer7     # Footer with newsletter
```

### Dashboard Recipe
```bash
# Admin dashboard
add-component dashboard1   # Dashboard layout
add-component chart5      # Analytics charts
add-component table8      # Data tables
add-component stats3      # Stats cards
```

### Marketing Site Recipe
```bash
# Full marketing site
add-component hero47      # Video background hero
add-component feature51   # Timeline features
add-component about1      # About section
add-component team6       # Team grid
add-component blog8       # Blog grid
add-component contact7    # Contact with map
```

## Quick Commands

For any premium component, just use:
```bash
npx shadcn@canary add "https://www.shadcnblocks.com/r/[COMPONENT_ID]?token=YOUR_TOKEN"
```

## Component Categories Quick Reference
- **hero1-147**: Landing heroes (premium: 25+)
- **feature1-239**: Feature sections (premium: 50+)
- **pricing1-32**: Pricing tables (premium: 10+)
- **dashboard1-15**: Dashboard layouts
- **chart1-20**: Data visualizations
- **form1-30**: Complex forms
- **gallery1-40**: Image galleries
- **timeline1-15**: Timeline components
- **stats1-25**: Statistics displays
- **team1-15**: Team sections

## Note
Token expires: 2025-01-24 (check timestamp in token)