# VS Code / Cursor Installation Guide

This guide covers setting up the Xano MCP in VS Code and Cursor for development workflows.

## Prerequisites

- VS Code or Cursor installed
- Node.js 18+ and npm
- Deployed Xano MCP Worker or local development server
- MCP extension for your editor

## Step 1: Install MCP Extension

### For VS Code

1. Open VS Code Extensions (Cmd/Ctrl + Shift + X)
2. Search for "Model Context Protocol" or "MCP"
3. Install the official MCP extension
4. Restart VS Code

### For Cursor

Cursor includes MCP support built-in. Ensure you have the latest version:

```bash
# Check Cursor version
cursor --version

# Update if needed
cursor update
```

## Step 2: Install MCP Remote

Install the MCP remote client globally:

```bash
npm install -g mcp-remote@latest
```

Verify installation:
```bash
mcp-remote --version
```

## Step 3: Configure MCP Connection

### Option A: Connect to Deployed Worker

1. Start the MCP remote proxy:
   ```bash
   mcp-remote proxy \
     --remote https://xano-mcp.your-account.workers.dev/mcp \
     --local http://localhost:3030 \
     --name xano-mcp
   ```

2. Configure VS Code/Cursor settings:
   ```json
   {
     "mcp.servers": {
       "xano-mcp": {
         "url": "http://localhost:3030",
         "name": "Xano MCP",
         "description": "Xano database operations"
       }
     }
   }
   ```

### Option B: Local Development Server

1. Clone and run the MCP Worker locally:
   ```bash
   cd test-mcp-deploy
   npm install
   npm run dev
   ```

2. Configure for local connection:
   ```json
   {
     "mcp.servers": {
       "xano-mcp-dev": {
         "url": "http://localhost:8787/mcp",
         "name": "Xano MCP (Dev)",
         "description": "Local Xano MCP development"
       }
     }
   }
   ```

## Step 4: Environment Configuration

### VS Code Settings

Create or update `.vscode/settings.json` in your project:

```json
{
  "mcp.defaultServer": "xano-mcp",
  "mcp.autoConnect": true,
  "mcp.requestTimeout": 30000,
  "mcp.enableLogging": true,
  "mcp.logLevel": "info"
}
```

### Environment Variables

Create a `.env` file for local development:

```bash
# MCP Configuration
MCP_SERVER_URL=http://localhost:8787/mcp
MCP_AUTH_TOKEN=your-dev-token

# Middleware Configuration
MIDDLEWARE_URL=http://localhost:3000
MIDDLEWARE_TIMEOUT=10000

# Xano Configuration
XANO_API_BASE_URL=https://your-instance.xano.io
XANO_API_KEY=your-api-key
```

## Step 5: Launch Configuration

### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "MCP Remote Proxy",
      "type": "node",
      "request": "launch",
      "program": "mcp-remote",
      "args": [
        "proxy",
        "--remote", "${env:MCP_SERVER_URL}",
        "--local", "http://localhost:3030",
        "--token", "${env:MCP_AUTH_TOKEN}"
      ],
      "env": {
        "DEBUG": "mcp:*"
      }
    },
    {
      "name": "Local MCP Worker",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/test-mcp-deploy",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ],
  "compounds": [
    {
      "name": "Full Stack",
      "configurations": ["Local MCP Worker", "MCP Remote Proxy"]
    }
  ]
}
```

### Tasks Configuration

Create `.vscode/tasks.json` for common workflows:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start MCP Stack",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev:all"],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "Test MCP Connection",
      "type": "shell",
      "command": "curl",
      "args": ["-i", "http://localhost:3030/schema"],
      "group": "test"
    },
    {
      "label": "Watch Logs",
      "type": "shell",
      "command": "tail",
      "args": ["-f", "logs/mcp.log"],
      "isBackground": true
    }
  ]
}
```

## Step 6: Extension Features

### Code Completion

The MCP extension provides IntelliSense for Xano operations:

```typescript
// Type '@xano' to trigger MCP suggestions
// @xano list tables in database prod

// @xano query users where status = 'active'
```

### Command Palette

Access MCP commands via Command Palette (Cmd/Ctrl + Shift + P):

- `MCP: Connect to Server`
- `MCP: List Available Tools`
- `MCP: Execute Tool`
- `MCP: Show Logs`

### Inline Actions

Use CodeLens actions in supported files:

```javascript
// 📊 Run Xano Query
const users = await xano.query('users', { 
  filter: { status: 'active' },
  limit: 10 
});
```

## Step 7: Development Workflow

### 1. Start Development Stack

```bash
# Terminal 1: Start middleware
cd test-middleware-deploy
npm run dev

# Terminal 2: Start MCP Worker
cd test-mcp-deploy
npm run dev

# Terminal 3: Start proxy
mcp-remote proxy --remote http://localhost:8787/mcp --local http://localhost:3030
```

### 2. Test Connection

In VS Code, open Command Palette and run:
- `MCP: Connect to Server`
- Select "xano-mcp"
- Verify connection status in status bar

### 3. Use MCP Tools

Example workflow in a JavaScript file:

```javascript
// Connect to Xano MCP
const mcp = await vscode.mcp.connect('xano-mcp');

// List available databases
const databases = await mcp.execute('xano_list_databases', {
  instance_name: 'your-instance'
});

// Create a new table
const result = await mcp.execute('xano_create_table', {
  instance_name: 'your-instance',
  workspace_id: 1,
  name: 'new_table',
  auth: true
});
```

## Troubleshooting

### Connection Issues

1. **"Cannot connect to MCP server"**
   ```bash
   # Check if proxy is running
   ps aux | grep mcp-remote
   
   # Test direct connection
   curl http://localhost:3030/schema
   ```

2. **"Authentication failed"**
   - Verify token in environment variables
   - Check proxy logs for auth errors
   - Ensure token has correct permissions

3. **"Tools not available"**
   - Restart VS Code/Cursor
   - Check MCP extension logs
   - Verify Worker is running

### Debug Configuration

Enable detailed logging:

```json
{
  "mcp.debug": true,
  "mcp.trace.server": "verbose",
  "mcp.logFile": "${workspaceFolder}/logs/mcp.log"
}
```

### Performance Optimization

1. **Reduce latency**:
   ```json
   {
     "mcp.requestTimeout": 60000,
     "mcp.keepAlive": true,
     "mcp.compression": true
   }
   ```

2. **Cache configuration**:
   ```json
   {
     "mcp.cache.enabled": true,
     "mcp.cache.ttl": 300000,
     "mcp.cache.maxSize": 100
   }
   ```

## Advanced Configuration

### Multiple MCP Servers

Configure multiple environments:

```json
{
  "mcp.servers": {
    "xano-dev": {
      "url": "http://localhost:3030",
      "name": "Xano Dev"
    },
    "xano-staging": {
      "url": "https://staging-proxy.company.com",
      "name": "Xano Staging"
    },
    "xano-prod": {
      "url": "https://prod-proxy.company.com",
      "name": "Xano Production"
    }
  },
  "mcp.defaultServer": "xano-dev"
}
```

### Custom Keybindings

Add to `keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+x",
    "command": "mcp.executeCommand",
    "args": {
      "server": "xano-mcp",
      "tool": "xano_browse_table_content"
    }
  },
  {
    "key": "ctrl+shift+q",
    "command": "mcp.quickQuery"
  }
]
```

### Workspace Integration

Create `.code-workspace` file:

```json
{
  "folders": [
    {
      "path": "xano-mcp-dashboard"
    },
    {
      "path": "test-mcp-deploy"
    },
    {
      "path": "test-middleware-deploy"
    }
  ],
  "settings": {
    "mcp.autoConnect": true,
    "mcp.defaultServer": "xano-mcp"
  },
  "extensions": {
    "recommendations": [
      "modelcontextprotocol.mcp",
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode"
    ]
  }
}
```

## Next Steps

- Set up [Local Development Environment](./installation-development.md)
- Configure [Cloud Deployment](./installation-cloud.md)
- Learn about [MCP Tools](../tools/reference.md)
- Review [Best Practices](../best-practices/development.md)