# Cloud Deployment Guide

This guide covers deploying the Xano MCP ecosystem to various cloud platforms.

## Architecture Overview

The complete deployment consists of:
- **MCP Worker** → Cloudflare Workers (Edge deployment)
- **Middleware** → AWS Lambda/ECS, Google Cloud Run, or any container platform
- **Dashboard** → Vercel, Cloudflare Pages, or Netlify

## Cloudflare Workers (MCP)

### Prerequisites

- Cloudflare account
- Wrangler CLI installed
- Node.js 18+

### Step 1: Install Dependencies

```bash
cd test-mcp-deploy
npm install
npm install -g wrangler
```

### Step 2: Configure Wrangler

Create `wrangler.toml`:

```toml
name = "xano-mcp"
main = "src/worker.ts"
compatibility_date = "2025-01-01"
workers_dev = false
minify = true

[observability]
enabled = true

[vars]
MIDDLEWARE_URL = "https://middleware.yourdomain.com"
ALLOWED_ORIGINS = "https://dashboard.yourdomain.com"
LOG_LEVEL = "info"

# Development environment
[env.dev]
name = "xano-mcp-dev"
workers_dev = true
[env.dev.vars]
ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:3001"
MIDDLEWARE_URL = "http://localhost:3000"
LOG_LEVEL = "debug"

# Staging environment
[env.staging]
name = "xano-mcp-staging"
[env.staging.vars]
MIDDLEWARE_URL = "https://staging-middleware.yourdomain.com"
ALLOWED_ORIGINS = "https://staging-dashboard.yourdomain.com"

# Custom domain routing
[[routes]]
pattern = "mcp.yourdomain.com/*"
zone_name = "yourdomain.com"

[[env.staging.routes]]
pattern = "staging-mcp.yourdomain.com/*"
zone_name = "yourdomain.com"
```

### Step 3: Set Secrets

```bash
# Production secrets
wrangler secret put OAUTH_CLIENT_ID
wrangler secret put OAUTH_CLIENT_SECRET
wrangler secret put XANO_API_KEY
wrangler secret put SENTRY_DSN

# Staging secrets
wrangler secret put OAUTH_CLIENT_ID --env staging
wrangler secret put OAUTH_CLIENT_SECRET --env staging
```

### Step 4: Deploy

```bash
# Deploy to production
npm run deploy

# Deploy to staging
wrangler deploy --env staging

# Deploy to dev (local preview)
npm run dev
```

### Step 5: Verify Deployment

```bash
# Check production
curl https://mcp.yourdomain.com/mcp/schema

# Check worker logs
wrangler tail

# Check metrics
wrangler analytics show
```

## Vercel (Dashboard)

### Prerequisites

- Vercel account
- Vercel CLI (optional)
- GitHub/GitLab/Bitbucket repository

### Step 1: Prepare for Deployment

```bash
cd xano-mcp-dashboard

# Build locally to verify
npm run build
```

### Step 2: Deploy via Git

1. Push code to Git repository
2. Import project in Vercel dashboard
3. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build:prod`
   - Output Directory: `.next`

### Step 3: Environment Variables

In Vercel dashboard, add:

```bash
NEXT_PUBLIC_MCP_URL=https://mcp.yourdomain.com/mcp
NEXT_PUBLIC_MIDDLEWARE_URL=https://middleware.yourdomain.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### Step 4: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_MCP_URL production
vercel env add NEXT_PUBLIC_MIDDLEWARE_URL production
```

## Cloudflare Pages (Dashboard Alternative)

### Step 1: Build Configuration

Create `pages.config.js`:

```javascript
export default {
  build: {
    command: "npm run build:prod",
    directory: ".next"
  },
  env: {
    NEXT_PUBLIC_MCP_URL: "https://mcp.yourdomain.com/mcp",
    NEXT_PUBLIC_MIDDLEWARE_URL: "https://middleware.yourdomain.com"
  }
}
```

### Step 2: Deploy

```bash
# Using Wrangler
npx wrangler pages deploy .next --project-name xano-dashboard

# Using Git integration
# 1. Connect GitHub repo in Cloudflare Pages
# 2. Set build command: npm run build:prod
# 3. Set output directory: .next
# 4. Configure environment variables
```

## AWS Lambda (Middleware)

### Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Docker installed

### Step 1: Create Lambda Container Image

Update `Dockerfile` for Lambda:

```dockerfile
FROM public.ecr.aws/lambda/nodejs:18

# Copy function code
COPY package*.json ${LAMBDA_TASK_ROOT}/
COPY xano-script-library ${LAMBDA_TASK_ROOT}/xano-script-library

# Install dependencies
WORKDIR ${LAMBDA_TASK_ROOT}/xano-script-library
RUN npm ci
RUN npm run build

WORKDIR ${LAMBDA_TASK_ROOT}
RUN npm ci --production

# Copy application code
COPY . ${LAMBDA_TASK_ROOT}

# Build TypeScript if needed
RUN if [ -f "tsconfig.json" ]; then npm run build; fi

# Set handler
CMD ["lambda-handler.handler"]
```

### Step 2: Create Lambda Handler

Create `lambda-handler.js`:

```javascript
const serverlessExpress = require('@codegenie/serverless-express');
const app = require('./server');

exports.handler = serverlessExpress({ app });
```

### Step 3: Build and Push to ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name xano-middleware

# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build and tag image
docker build -t xano-middleware .
docker tag xano-middleware:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/xano-middleware:latest

# Push image
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/xano-middleware:latest
```

### Step 4: Deploy Lambda Function

```bash
# Create Lambda function
aws lambda create-function \
  --function-name xano-middleware \
  --package-type Image \
  --code ImageUri=123456789012.dkr.ecr.us-east-1.amazonaws.com/xano-middleware:latest \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables="{NODE_ENV=production,XANO_API_URL=https://your-instance.xano.io}"
```

### Step 5: Configure API Gateway

```bash
# Create REST API
aws apigatewayv2 create-api \
  --name xano-middleware-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:123456789012:function:xano-middleware
```

## Google Cloud Run (Middleware Alternative)

### Step 1: Prepare Container

```bash
# Build container
docker build -t gcr.io/your-project/xano-middleware .

# Push to Google Container Registry
docker push gcr.io/your-project/xano-middleware
```

### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy xano-middleware \
  --image gcr.io/your-project/xano-middleware \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,XANO_API_URL=https://your-instance.xano.io"
```

## Production Configuration

### Environment Variables

Create `.env.production` for each service:

#### MCP Worker
```bash
# Set via wrangler secrets
OAUTH_CLIENT_ID=prod-client-id
OAUTH_CLIENT_SECRET=prod-client-secret
SENTRY_DSN=https://xxx@sentry.io/xxx
```

#### Middleware
```bash
NODE_ENV=production
PORT=3000
XANO_API_BASE_URL=https://your-instance.xano.io
XANO_API_KEY=your-production-key
CORS_ORIGINS=https://dashboard.yourdomain.com,https://mcp.yourdomain.com
REDIS_URL=redis://your-redis-instance:6379
SENTRY_DSN=https://xxx@sentry.io/xxx
```

#### Dashboard
```bash
NEXT_PUBLIC_MCP_URL=https://mcp.yourdomain.com/mcp
NEXT_PUBLIC_MIDDLEWARE_URL=https://middleware.yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Security Headers

Add security headers to all services:

```javascript
// Cloudflare Worker
export default {
  async fetch(request, env) {
    const response = await handleRequest(request, env);
    
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    return response;
  }
}
```

### Monitoring Setup

1. **Cloudflare Analytics**
   - Enable in dashboard
   - Set up alerts for error rates

2. **AWS CloudWatch** (for Lambda)
   ```bash
   aws logs create-log-group --log-group-name /aws/lambda/xano-middleware
   aws logs put-retention-policy \
     --log-group-name /aws/lambda/xano-middleware \
     --retention-in-days 30
   ```

3. **Sentry Integration**
   ```javascript
   // Worker
   import * as Sentry from '@sentry/cloudflare';
   
   Sentry.init({
     dsn: env.SENTRY_DSN,
     environment: 'production',
     tracesSampleRate: 0.1
   });
   ```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy All Services

on:
  push:
    branches: [main]

jobs:
  deploy-worker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
        working-directory: test-mcp-deploy
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          workingDirectory: test-mcp-deploy

  deploy-middleware:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: 123456789012.dkr.ecr.us-east-1.amazonaws.com
          username: AWS
          password: ${{ secrets.AWS_ECR_PASSWORD }}
      - uses: docker/build-push-action@v5
        with:
          context: ./test-middleware-deploy
          push: true
          tags: 123456789012.dkr.ecr.us-east-1.amazonaws.com/xano-middleware:latest
      - run: |
          aws lambda update-function-code \
            --function-name xano-middleware \
            --image-uri 123456789012.dkr.ecr.us-east-1.amazonaws.com/xano-middleware:latest

  deploy-dashboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
        working-directory: xano-mcp-dashboard
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: xano-mcp-dashboard
```

## Post-Deployment Checklist

- [ ] Verify all endpoints are accessible
- [ ] Test authentication flow
- [ ] Check CORS configuration
- [ ] Validate environment variables
- [ ] Test error handling
- [ ] Monitor initial traffic
- [ ] Set up alerts
- [ ] Document API endpoints
- [ ] Create runbook for incidents

## Next Steps

- Configure [Docker Deployment](./installation-docker.md) for containerized environments
- Set up [Development Environment](./installation-development.md)
- Implement [Monitoring and Alerts](../monitoring/setup.md)
- Review [Security Best Practices](../security/production.md)