# Docker & Container Setup Guide

This guide covers containerizing and deploying the Xano MCP ecosystem using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+ installed
- Docker Compose 2.0+ installed
- Basic understanding of container concepts
- Access to a container registry (optional for production)

## Quick Start with Docker Compose

### Step 1: Create Docker Compose Configuration

Create `docker-compose.yml` in your project root:

```yaml
version: "3.9"

services:
  # Performance Middleware
  middleware:
    build: 
      context: ./test-middleware-deploy
      dockerfile: Dockerfile
    image: xano-middleware:latest
    container_name: xano-middleware
    env_file:
      - ./test-middleware-deploy/.env
    environment:
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/healthz"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 40s
    restart: unless-stopped
    networks:
      - xano-network
    volumes:
      - ./logs/middleware:/app/logs

  # Next.js Dashboard
  dashboard:
    build:
      context: ./xano-mcp-dashboard
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_MCP_URL=https://mcp.yourdomain.com/mcp
        - NEXT_PUBLIC_MIDDLEWARE_URL=http://middleware:3000
    image: xano-dashboard:latest
    container_name: xano-dashboard
    environment:
      - NODE_ENV=production
      - PORT=3001
    ports:
      - "3001:3001"
    depends_on:
      middleware:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - xano-network
    volumes:
      - ./logs/dashboard:/app/logs

  # Redis Cache (optional)
  redis:
    image: redis:7-alpine
    container_name: xano-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - xano-network
    command: redis-server --save 60 1 --loglevel warning

  # Nginx Reverse Proxy (optional)
  nginx:
    image: nginx:alpine
    container_name: xano-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx-cache:/var/cache/nginx
    depends_on:
      - middleware
      - dashboard
    restart: unless-stopped
    networks:
      - xano-network

networks:
  xano-network:
    driver: bridge

volumes:
  redis-data:
  nginx-cache:
```

### Step 2: Create Dockerfile for Dashboard

Create `xano-mcp-dashboard/Dockerfile`:

```dockerfile
# Multi-stage build for Next.js
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_MCP_URL
ARG NEXT_PUBLIC_MIDDLEWARE_URL
ENV NEXT_PUBLIC_MCP_URL=$NEXT_PUBLIC_MCP_URL
ENV NEXT_PUBLIC_MIDDLEWARE_URL=$NEXT_PUBLIC_MIDDLEWARE_URL

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]
```

### Step 3: Update Middleware Dockerfile

The existing Dockerfile is good, but here's an optimized version:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY xano-script-library/package*.json ./xano-script-library/
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY xano-script-library ./xano-script-library
RUN cd xano-script-library && npm ci && npm run build
RUN npm ci
COPY . .
RUN if [ -f "tsconfig.json" ]; then npm run build; fi

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/xano-script-library ./xano-script-library
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/routes ./routes

USER expressjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthz', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
```

### Step 4: Environment Configuration

Create `.env` files for each service:

#### middleware/.env
```bash
NODE_ENV=production
PORT=3000
XANO_API_BASE_URL=https://your-instance.xano.io
XANO_API_KEY=your-api-key
CORS_ORIGINS=http://localhost:3001,https://dashboard.yourdomain.com
REDIS_URL=redis://redis:6379
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
```

#### dashboard/.env
```bash
# These are build-time variables
NEXT_PUBLIC_MCP_URL=https://mcp.yourdomain.com/mcp
NEXT_PUBLIC_MIDDLEWARE_URL=http://middleware:3000
NEXT_PUBLIC_ENVIRONMENT=production
```

### Step 5: Nginx Configuration

Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream middleware {
        server middleware:3000;
    }

    upstream dashboard {
        server dashboard:3001;
    }

    # Cache settings
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Middleware API
        location /api/ {
            proxy_pass http://middleware/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            
            # Cache GET requests
            proxy_cache api_cache;
            proxy_cache_valid 200 5m;
            proxy_cache_methods GET HEAD;
            add_header X-Cache-Status $upstream_cache_status;
        }

        # Dashboard
        location / {
            proxy_pass http://dashboard;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## Development Setup

### Local Development with Hot Reload

Create `docker-compose.dev.yml`:

```yaml
version: "3.9"

services:
  middleware:
    build: 
      context: ./test-middleware-deploy
      target: builder
    volumes:
      - ./test-middleware-deploy:/app
      - /app/node_modules
      - /app/xano-script-library/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  dashboard:
    build:
      context: ./xano-mcp-dashboard
      target: builder
    volumes:
      - ./xano-mcp-dashboard:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_MCP_URL=http://localhost:8787/mcp
      - NEXT_PUBLIC_MIDDLEWARE_URL=http://localhost:3000
    command: npm run dev

  # Local Cloudflare Worker (optional)
  worker:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./test-mcp-deploy:/app
    ports:
      - "8787:8787"
    environment:
      - MIDDLEWARE_URL=http://middleware:3000
      - ALLOWED_ORIGINS=http://localhost:3001
    command: sh -c "npm install && npx wrangler dev --local --ip 0.0.0.0 --port 8787"
```

Run development stack:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Production Deployment

### Step 1: Build Images

```bash
# Build all images
docker-compose build

# Or build individually
docker build -t xano-middleware:latest ./test-middleware-deploy
docker build -t xano-dashboard:latest ./xano-mcp-dashboard
```

### Step 2: Tag and Push to Registry

```bash
# Docker Hub
docker tag xano-middleware:latest yourusername/xano-middleware:latest
docker push yourusername/xano-middleware:latest

# AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker tag xano-middleware:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/xano-middleware:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/xano-middleware:latest

# Google Container Registry
docker tag xano-middleware:latest gcr.io/your-project/xano-middleware:latest
docker push gcr.io/your-project/xano-middleware:latest
```

### Step 3: Deploy with Docker Swarm

Initialize Swarm:
```bash
docker swarm init
```

Create `docker-stack.yml`:

```yaml
version: "3.9"

services:
  middleware:
    image: yourusername/xano-middleware:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    environment:
      - NODE_ENV=production
    secrets:
      - xano_api_key
    networks:
      - xano-network

  dashboard:
    image: yourusername/xano-dashboard:latest
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
    networks:
      - xano-network

secrets:
  xano_api_key:
    external: true

networks:
  xano-network:
    driver: overlay
    attachable: true
```

Deploy stack:
```bash
docker stack deploy -c docker-stack.yml xano-mcp
```

## Kubernetes Deployment

### Step 1: Create Kubernetes Manifests

Create `k8s/middleware-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xano-middleware
spec:
  replicas: 3
  selector:
    matchLabels:
      app: xano-middleware
  template:
    metadata:
      labels:
        app: xano-middleware
    spec:
      containers:
      - name: middleware
        image: yourusername/xano-middleware:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: XANO_API_KEY
          valueFrom:
            secretKeyRef:
              name: xano-secrets
              key: api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: xano-middleware
spec:
  selector:
    app: xano-middleware
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

### Step 2: Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace xano-mcp

# Create secrets
kubectl create secret generic xano-secrets \
  --from-literal=api-key=your-api-key \
  -n xano-mcp

# Apply manifests
kubectl apply -f k8s/ -n xano-mcp

# Check deployment
kubectl get pods -n xano-mcp
kubectl get svc -n xano-mcp
```

## Monitoring and Logging

### Docker Logging Configuration

Update `docker-compose.yml`:

```yaml
services:
  middleware:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=middleware"
```

### Prometheus Monitoring

Add Prometheus and Grafana:

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - xano-network

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - "3003:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - xano-network

volumes:
  prometheus-data:
  grafana-data:
```

## Best Practices

### 1. Security

```yaml
# Use specific versions, not latest
image: xano-middleware:1.0.0

# Run as non-root user
user: "1001:1001"

# Read-only root filesystem
read_only: true
tmpfs:
  - /tmp
  - /app/logs

# Security options
security_opt:
  - no-new-privileges:true
```

### 2. Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### 3. Health Checks

```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost:3000/healthz || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### 4. Multi-Stage Builds

Always use multi-stage builds to:
- Reduce image size
- Improve security
- Separate build and runtime dependencies

### 5. Layer Caching

Order Dockerfile commands for optimal caching:
1. Install system dependencies
2. Copy dependency files
3. Install dependencies
4. Copy source code
5. Build application

## Troubleshooting

### Common Issues

1. **Container fails to start**
   ```bash
   # Check logs
   docker-compose logs middleware
   
   # Inspect container
   docker inspect xano-middleware
   ```

2. **Network connectivity issues**
   ```bash
   # Test internal DNS
   docker-compose exec dashboard ping middleware
   
   # Check network
   docker network inspect xano-mcp_xano-network
   ```

3. **Permission errors**
   ```bash
   # Fix volume permissions
   docker-compose exec middleware chown -R 1001:1001 /app/logs
   ```

4. **Memory issues**
   ```bash
   # Check resource usage
   docker stats
   
   # Increase limits in docker-compose.yml
   ```

## Next Steps

- Set up [Local Development](./installation-development.md)
- Configure [CI/CD Pipeline](../ci-cd/docker-builds.md)
- Implement [Container Security](../security/containers.md)
- Deploy to [Kubernetes](../kubernetes/setup.md)