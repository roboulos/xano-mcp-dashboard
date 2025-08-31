# Claude Desktop Installation Guide

This guide walks you through connecting Claude Desktop to your Xano MCP deployment.

## Prerequisites

- Claude Desktop application installed
- Deployed Xano MCP Worker (see [Cloud Deployment Guide](./installation-cloud.md))
- `mcp-remote` CLI tool
- Valid Xano API credentials

## Step 1: Install MCP Remote

The `mcp-remote` tool enables secure connections between Claude Desktop and your MCP Worker.

```bash
npm install -g mcp-remote@latest
```

Verify installation:
```bash
mcp-remote --version
```

## Step 2: Deploy MCP Worker

If you haven't already deployed the MCP Worker to Cloudflare:

1. Follow the [Cloud Deployment Guide](./installation-cloud.md#cloudflare-workers)
2. Note your Worker URL (e.g., `https://xano-mcp.your-account.workers.dev`)
3. Ensure the Worker is accessible and returns the schema:
   ```bash
   curl https://xano-mcp.your-account.workers.dev/mcp/schema
   ```

## Step 3: Configure Claude Desktop

### Locate Configuration File

The Claude Desktop configuration file location varies by platform:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

### Basic Configuration

Create or edit the configuration file:

```json
{
  "mcpServers": {
    "xano-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "connect",
        "https://xano-mcp.your-account.workers.dev/mcp"
      ],
      "env": {
        "MCP_SERVER_NAME": "xano-mcp",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Authenticated Configuration

If your MCP Worker requires authentication:

```json
{
  "mcpServers": {
    "xano-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "connect",
        "https://xano-mcp.your-account.workers.dev/mcp",
        "--token",
        "${XANO_MCP_TOKEN}"
      ],
      "env": {
        "XANO_MCP_TOKEN": "your-auth-token",
        "MCP_SERVER_NAME": "xano-mcp",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### WebSocket Configuration

For WebSocket connections (recommended for real-time features):

```json
{
  "mcpServers": {
    "xano-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "connect",
        "wss://xano-mcp.your-account.workers.dev/mcp/ws"
      ],
      "env": {
        "MCP_SERVER_NAME": "xano-mcp",
        "WEBSOCKET_RECONNECT": "true",
        "WEBSOCKET_PING_INTERVAL": "30000"
      }
    }
  }
}
```

## Step 4: Test Connection

1. **Restart Claude Desktop** to load the new configuration

2. **Verify MCP is loaded** by typing in Claude:
   ```
   What MCP servers are available?
   ```

3. **Test Xano tools** by asking Claude:
   ```
   Can you list the available Xano tools?
   ```

4. **Run a test query**:
   ```
   Using the Xano MCP, can you list my databases?
   ```

## Step 5: Environment-Specific Setup

### Development Environment

For local development with a local MCP server:

```json
{
  "mcpServers": {
    "xano-mcp-dev": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "connect",
        "http://localhost:8787/mcp"
      ],
      "env": {
        "NODE_ENV": "development",
        "MIDDLEWARE_URL": "http://localhost:3000",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Production Environment

For production with enhanced security:

```json
{
  "mcpServers": {
    "xano-mcp-prod": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "connect",
        "https://mcp.yourdomain.com/mcp",
        "--token-file",
        "~/.xano-mcp/token"
      ],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "warn",
        "TIMEOUT": "30000"
      }
    }
  }
}
```

## Troubleshooting

### Connection Issues

1. **"Failed to connect to MCP server"**
   - Verify Worker URL is correct
   - Check Worker logs: `npx wrangler tail`
   - Ensure CORS allows Claude Desktop origin

2. **"Authentication failed"**
   - Verify token is correct
   - Check token expiration
   - Ensure OAuth configuration in Worker

3. **"No tools available"**
   - Check Worker deployment status
   - Verify `/mcp/schema` endpoint returns tools
   - Check for JavaScript errors in Worker logs

### Debug Mode

Enable verbose logging for troubleshooting:

```json
{
  "mcpServers": {
    "xano-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "connect",
        "https://xano-mcp.your-account.workers.dev/mcp",
        "--verbose"
      ],
      "env": {
        "DEBUG": "mcp:*",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Validation Commands

Test your setup with these commands:

```bash
# Test direct Worker access
curl -i https://xano-mcp.your-account.workers.dev/mcp/schema

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://xano-mcp.your-account.workers.dev/mcp/schema

# Test WebSocket connection
wscat -c wss://xano-mcp.your-account.workers.dev/mcp/ws
```

## Security Best Practices

1. **Token Management**
   - Never commit tokens to version control
   - Use token files instead of inline tokens
   - Rotate tokens regularly

2. **Network Security**
   - Always use HTTPS/WSS in production
   - Restrict CORS origins in Worker configuration
   - Enable Cloudflare security features

3. **Access Control**
   - Implement user-specific tokens
   - Log all MCP access for auditing
   - Set appropriate timeout values

## Next Steps

- Configure [VS Code Integration](./installation-vscode.md) for development
- Set up [Monitoring and Alerts](../monitoring/setup.md)
- Review [Security Guidelines](../security/best-practices.md)
- Explore [Available Tools](../tools/reference.md)