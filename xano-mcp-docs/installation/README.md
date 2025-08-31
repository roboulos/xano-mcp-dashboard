# Xano MCP Installation Documentation

Welcome to the comprehensive installation guide for the Xano Model Context Protocol (MCP) ecosystem. This documentation provides detailed instructions for deploying and configuring all components of the system.

## Documentation Structure

### 📚 Installation Guides

1. **[Installation Overview](./installation-overview.md)**
   - Quick start guide
   - System architecture overview
   - Environment variables reference
   - Verification steps

2. **[Claude Desktop Installation](./installation-claude-desktop.md)**
   - Step-by-step Claude Desktop integration
   - MCP configuration format
   - Authentication setup
   - Troubleshooting connection issues

3. **[VS Code / Cursor Installation](./installation-vscode.md)**
   - Editor extension setup
   - MCP remote proxy configuration
   - Development workflow integration
   - Debugging configuration

4. **[Cloud Deployment Guide](./installation-cloud.md)**
   - Cloudflare Workers deployment (MCP)
   - Vercel/Cloudflare Pages deployment (Dashboard)
   - AWS Lambda/Google Cloud Run deployment (Middleware)
   - Production configuration and security

5. **[Docker & Container Setup](./installation-docker.md)**
   - Docker Compose configuration
   - Multi-stage Dockerfile optimization
   - Kubernetes deployment
   - Container orchestration

6. **[Local Development Setup](./installation-development.md)**
   - Development environment requirements
   - Repository setup and structure
   - Testing and debugging tools
   - Development workflow

## Quick Installation

### Prerequisites

- Node.js 18+ and npm
- Git
- Cloudflare account (for Worker deployment)
- Docker (optional, for containerized deployment)

### Fastest Path to Production

1. **Deploy MCP Worker to Cloudflare**
   ```bash
   cd test-mcp-deploy
   npm install
   wrangler login
   npm run deploy
   ```

2. **Deploy Middleware**
   ```bash
   cd test-middleware-deploy
   docker build -t xano-middleware .
   docker run -p 3000:3000 xano-middleware
   ```

3. **Deploy Dashboard**
   ```bash
   cd xano-mcp-dashboard
   vercel --prod
   ```

4. **Configure Claude Desktop**
   ```json
   {
     "mcpServers": {
       "xano-mcp": {
         "command": "npx",
         "args": ["mcp-remote", "connect", "https://your-worker.workers.dev/mcp"]
       }
     }
   }
   ```

## Component Overview

### 🚀 Xano MCP Worker (`snappy-mcp-turbo`)

- **Purpose**: Provides MCP interface for AI assistants
- **Technology**: Cloudflare Workers, TypeScript
- **Key Features**: 
  - WebSocket/SSE support
  - OAuth authentication
  - Tool discovery and execution
  - Edge deployment for low latency

### 📊 Performance Middleware (`snappy-middleware`)

- **Purpose**: Caching layer and performance optimization
- **Technology**: Node.js, Express
- **Key Features**:
  - 95%+ token usage reduction
  - Request caching
  - Xano API proxy
  - Health monitoring

### 🎨 Dashboard Interface (`xano-mcp-dashboard`)

- **Purpose**: Web interface for management and monitoring
- **Technology**: Next.js 15, React, TypeScript
- **Key Features**:
  - Real-time monitoring
  - Configuration management
  - Analytics and logging
  - User authentication

## Deployment Options

### Cloud-Native Deployment

Best for production environments with scalability requirements:

- **MCP Worker**: Cloudflare Workers (global edge network)
- **Middleware**: AWS Lambda or Google Cloud Run
- **Dashboard**: Vercel or Cloudflare Pages

### Container-Based Deployment

Best for self-hosted environments or private clouds:

- Use Docker Compose for the complete stack
- Deploy to Kubernetes for orchestration
- Suitable for on-premise requirements

### Local Development

Best for development and testing:

- Run all services locally
- Hot reload and debugging enabled
- Mock services available

## Security Considerations

### Authentication

- OAuth 2.0 support via Cloudflare Workers
- API key authentication for Xano
- Token-based MCP authentication

### Network Security

- HTTPS/WSS required in production
- CORS configuration for cross-origin requests
- Rate limiting and DDoS protection

### Best Practices

1. Never commit secrets to version control
2. Use environment-specific configurations
3. Rotate API keys regularly
4. Enable monitoring and alerting
5. Implement proper error handling

## Troubleshooting

### Common Issues

1. **Connection failures**: Check CORS, authentication, and network connectivity
2. **Performance issues**: Verify caching configuration and resource limits
3. **Deployment errors**: Review logs and environment variables

### Debug Mode

Enable verbose logging across all components:

```bash
# MCP Worker
LOG_LEVEL=debug

# Middleware
DEBUG=* LOG_LEVEL=debug

# Dashboard
NEXT_PUBLIC_ENABLE_DEBUG=true
```

## Support and Resources

### Getting Help

- **GitHub Issues**: [Report bugs and request features](https://github.com/your-org/xano-mcp)
- **Documentation**: [Full documentation](https://docs.xano-mcp.com)
- **Community**: [Discord server](https://discord.gg/xano-mcp)

### Additional Resources

- [API Reference](../api-reference/index.md)
- [Tool Documentation](../tools/reference.md)
- [Security Guidelines](../security/best-practices.md)
- [Monitoring Setup](../monitoring/setup.md)

## Version Compatibility

| Component | Version | Node.js | Dependencies |
|-----------|---------|---------|--------------|
| MCP Worker | 1.0.0 | 18+ | Wrangler 4.25+ |
| Middleware | 1.0.0 | 18+ | Express 5.1+ |
| Dashboard | 1.0.0 | 18+ | Next.js 15+ |

## Contributing

We welcome contributions! Please see our [Contributing Guide](../contributing.md) for details on:

- Code style and standards
- Testing requirements
- Pull request process
- Development setup

## License

This project is licensed under the MIT License. See [LICENSE](../../LICENSE) for details.

---

**Last Updated**: January 2025
**Documentation Version**: 1.0.0