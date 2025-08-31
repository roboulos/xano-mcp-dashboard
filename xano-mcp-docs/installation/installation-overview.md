# Xano MCP Installation Overview

Welcome to the Xano Model Context Protocol (MCP) ecosystem installation guide. This document provides a quick start overview of the installation process for all components.

## System Architecture

The Xano MCP ecosystem consists of three main components:

1. **Xano MCP Worker** (`snappy-mcp-turbo`) - A Cloudflare Worker providing the MCP interface
2. **Performance Middleware** (`snappy-middleware`) - Node.js/Express service for caching and optimization (95%+ token reduction)
3. **Dashboard Interface** (`xano-mcp-dashboard`) - Next.js web interface for management and monitoring

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Docker (optional, for containerized deployment)
- Cloudflare account (for Worker deployment)
- Xano instance and API credentials

### Installation Options

Choose your deployment strategy:

1. **Claude Desktop Integration** → [installation-claude-desktop.md](./installation-claude-desktop.md)
   - Connects Claude Desktop to your deployed MCP Worker
   - Uses `mcp-remote` for secure WebSocket connections

2. **VS Code/Cursor Integration** → [installation-vscode.md](./installation-vscode.md)
   - Local development with MCP extensions
   - Proxy setup for editor integration

3. **Cloud Deployment** → [installation-cloud.md](./installation-cloud.md)
   - Cloudflare Workers (MCP)
   - Vercel/Cloudflare Pages (Dashboard)
   - AWS Lambda/ECS (Middleware)

4. **Docker Deployment** → [installation-docker.md](./installation-docker.md)
   - Complete stack with Docker Compose
   - Production-ready containerization

5. **Local Development** → [installation-development.md](./installation-development.md)
   - Development environment setup
   - Testing and debugging tools

## Environment Variables

Each component requires specific environment configuration:

### MCP Worker
```bash
MIDDLEWARE_URL=https://your-middleware.com
ALLOWED_ORIGINS=https://your-dashboard.com
OAUTH_CLIENT_ID=your-oauth-id
OAUTH_CLIENT_SECRET=your-oauth-secret
```

### Middleware
```bash
NODE_ENV=production
PORT=3000
XANO_API_BASE_URL=https://your-instance.xano.io
XANO_API_KEY=your-api-key
CORS_ORIGINS=https://your-dashboard.com
```

### Dashboard
```bash
NEXT_PUBLIC_API_URL=https://your-middleware.com
NEXT_PUBLIC_MCP_URL=https://your-worker.workers.dev
```

## Verification Steps

After installation, verify each component:

1. **Test MCP Worker**
   ```bash
   curl https://your-worker.workers.dev/mcp/schema
   ```

2. **Check Middleware Health**
   ```bash
   curl https://your-middleware.com/healthz
   ```

3. **Access Dashboard**
   - Navigate to https://your-dashboard.com
   - Verify connection indicators

## Support Resources

- [Troubleshooting Guide](../troubleshooting/common-issues.md)
- [API Reference](../api-reference/index.md)
- [GitHub Repository](https://github.com/your-org/xano-mcp)

## Next Steps

1. Choose your deployment method from the installation guides above
2. Configure environment variables for your setup
3. Deploy components in order: Middleware → Worker → Dashboard
4. Run verification tests
5. Configure monitoring and alerts

For questions or issues, please refer to our troubleshooting guide or open an issue on GitHub.