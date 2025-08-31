# Local Development Setup Guide

This guide covers setting up a complete local development environment for the Xano MCP ecosystem.

## System Requirements

- **Node.js**: Version 18.x or 20.x (recommend using nvm)
- **npm**: Version 9.x or higher
- **Git**: Version 2.x or higher
- **Docker**: Version 20.10+ (optional but recommended)
- **OS**: macOS, Linux, or Windows with WSL2

### Memory Requirements
- Minimum: 8GB RAM
- Recommended: 16GB RAM
- Disk Space: 2GB free space

## Step 1: Environment Setup

### Install Node Version Manager (nvm)

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows (use nvm-windows)
# Download from: https://github.com/coreybutler/nvm-windows

# Install and use Node.js 18
nvm install 18
nvm use 18
```

### Verify Installation

```bash
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
git --version   # Should show 2.x.x or higher
```

## Step 2: Clone Repositories

### Clone All Components

```bash
# Create project directory
mkdir xano-mcp-dev && cd xano-mcp-dev

# Clone repositories
git clone https://github.com/your-org/test-mcp-deploy.git
git clone https://github.com/your-org/test-middleware-deploy.git
git clone https://github.com/your-org/xano-mcp-dashboard.git

# Optional: Clone shared libraries
git clone https://github.com/your-org/xano-script-library.git
```

### Project Structure

```
xano-mcp-dev/
├── test-mcp-deploy/          # Cloudflare Worker (MCP)
├── test-middleware-deploy/   # Express middleware
├── xano-mcp-dashboard/       # Next.js dashboard
└── xano-script-library/      # Shared utilities
```

## Step 3: Install Dependencies

### Install All Dependencies

Create a setup script `setup-dev.sh`:

```bash
#!/bin/bash

echo "Installing dependencies for all projects..."

# Install MCP Worker dependencies
echo "Setting up MCP Worker..."
cd test-mcp-deploy
npm ci
npm install -g wrangler@latest

# Install Middleware dependencies
echo "Setting up Middleware..."
cd ../test-middleware-deploy
npm ci

# Build xano-script-library if it exists
if [ -d "xano-script-library" ]; then
    cd xano-script-library
    npm ci
    npm run build
    cd ..
fi

# Install Dashboard dependencies
echo "Setting up Dashboard..."
cd ../xano-mcp-dashboard
npm ci

# Install global tools
echo "Installing global tools..."
npm install -g mcp-remote@latest
npm install -g nodemon@latest
npm install -g concurrently@latest

echo "Setup complete!"
```

Run the setup:
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

## Step 4: Environment Configuration

### Create Environment Files

#### MCP Worker (.dev.vars)
Create `test-mcp-deploy/.dev.vars`:

```bash
# Middleware connection
MIDDLEWARE_URL=http://localhost:3000

# CORS configuration
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# OAuth (optional)
OAUTH_CLIENT_ID=dev-client-id
OAUTH_CLIENT_SECRET=dev-client-secret

# Logging
LOG_LEVEL=debug

# Development flags
DEBUG=true
MOCK_AUTH=true
```

#### Middleware (.env)
Create `test-middleware-deploy/.env`:

```bash
# Server configuration
NODE_ENV=development
PORT=3000

# Xano configuration
XANO_API_BASE_URL=https://your-dev-instance.xano.io
XANO_API_KEY=your-dev-api-key

# CORS
CORS_ORIGINS=http://localhost:3001,http://localhost:8787

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty

# Development features
MOCK_XANO=false
REQUEST_TIMEOUT=60000
ENABLE_REQUEST_LOGGING=true
```

#### Dashboard (.env.local)
Create `xano-mcp-dashboard/.env.local`:

```bash
# API endpoints
NEXT_PUBLIC_MCP_URL=http://localhost:8787/mcp
NEXT_PUBLIC_MIDDLEWARE_URL=http://localhost:3000

# Environment
NEXT_PUBLIC_ENVIRONMENT=development

# Feature flags
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_SHOW_DEV_TOOLS=true

# Analytics (disabled in dev)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

### Create Dev Configuration

Create `dev-config.json`:

```json
{
  "services": {
    "worker": {
      "port": 8787,
      "host": "localhost",
      "protocol": "http"
    },
    "middleware": {
      "port": 3000,
      "host": "localhost",
      "protocol": "http"
    },
    "dashboard": {
      "port": 3001,
      "host": "localhost",
      "protocol": "http"
    }
  },
  "xano": {
    "instance": "your-dev-instance",
    "workspace": "development"
  },
  "features": {
    "mockAuth": true,
    "verboseLogging": true,
    "hotReload": true
  }
}
```

## Step 5: Development Scripts

### Create Master Dev Script

Create `dev.js` in the root:

```javascript
const { spawn } = require('child_process');
const chalk = require('chalk');

const services = [
  {
    name: 'Middleware',
    dir: './test-middleware-deploy',
    command: 'npm',
    args: ['run', 'dev'],
    color: chalk.blue,
    port: 3000
  },
  {
    name: 'Worker',
    dir: './test-mcp-deploy',
    command: 'npm',
    args: ['run', 'dev'],
    color: chalk.green,
    port: 8787
  },
  {
    name: 'Dashboard',
    dir: './xano-mcp-dashboard',
    command: 'npm',
    args: ['run', 'dev'],
    color: chalk.magenta,
    port: 3001
  }
];

const processes = [];

services.forEach(service => {
  console.log(service.color(`Starting ${service.name}...`));
  
  const proc = spawn(service.command, service.args, {
    cwd: service.dir,
    stdio: 'pipe',
    shell: true
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(service.color(`[${service.name}] ${line}`));
      }
    });
  });

  proc.stderr.on('data', (data) => {
    console.error(chalk.red(`[${service.name}] ${data}`));
  });

  processes.push(proc);
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nShutting down services...'));
  processes.forEach(proc => proc.kill());
  process.exit();
});
```

### Add npm Scripts

Update root `package.json`:

```json
{
  "name": "xano-mcp-dev",
  "version": "1.0.0",
  "scripts": {
    "dev": "node dev.js",
    "dev:middleware": "cd test-middleware-deploy && npm run dev",
    "dev:worker": "cd test-mcp-deploy && npm run dev",
    "dev:dashboard": "cd xano-mcp-dashboard && npm run dev",
    "test": "npm run test:middleware && npm run test:worker",
    "test:middleware": "cd test-middleware-deploy && npm test",
    "test:worker": "cd test-mcp-deploy && npm test",
    "build": "npm run build:all",
    "build:all": "concurrently \"npm run build:middleware\" \"npm run build:dashboard\"",
    "build:middleware": "cd test-middleware-deploy && npm run build",
    "build:dashboard": "cd xano-mcp-dashboard && npm run build",
    "clean": "find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +",
    "setup": "./setup-dev.sh",
    "lint": "npm run lint:all",
    "lint:all": "concurrently \"npm run lint:middleware\" \"npm run lint:worker\" \"npm run lint:dashboard\"",
    "lint:middleware": "cd test-middleware-deploy && npm run lint",
    "lint:worker": "cd test-mcp-deploy && npm run lint:xano",
    "lint:dashboard": "cd xano-mcp-dashboard && npm run lint"
  },
  "devDependencies": {
    "chalk": "^4.1.2",
    "concurrently": "^8.2.0"
  }
}
```

## Step 6: Development Tools

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Middleware",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/test-middleware-deploy",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Dashboard",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/xano-mcp-dashboard",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "pattern": "ready on http://localhost:([0-9]+)",
        "uriFormat": "http://localhost:%s",
        "action": "openExternally"
      }
    }
  ],
  "compounds": [
    {
      "name": "Full Stack Debug",
      "configurations": ["Debug Middleware", "Debug Dashboard"],
      "stopAll": true
    }
  ]
}
```

### Git Hooks

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint:all

# Run type checking
cd xano-mcp-dashboard && npm run typecheck
```

## Step 7: Testing Setup

### Create Test Configuration

Create `test-middleware-deploy/test/config/test.config.js`:

```javascript
module.exports = {
  xano: {
    mockUrl: 'http://localhost:9999',
    testInstance: 'test-instance',
    testWorkspace: 1,
    testApiKey: 'test-key-123'
  },
  timeouts: {
    unit: 5000,
    integration: 30000,
    e2e: 60000
  },
  coverage: {
    threshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
};
```

### Mock Server Setup

Create `test-middleware-deploy/test/mocks/xano-mock-server.js`:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Mock endpoints
app.get('/api/databases', (req, res) => {
  res.json({
    databases: [
      { id: 1, name: 'development' },
      { id: 2, name: 'staging' }
    ]
  });
});

app.get('/api/tables/:dbId', (req, res) => {
  res.json({
    tables: [
      { id: 1, name: 'users' },
      { id: 2, name: 'posts' }
    ]
  });
});

const PORT = process.env.MOCK_PORT || 9999;
app.listen(PORT, () => {
  console.log(`Mock Xano server running on port ${PORT}`);
});
```

## Step 8: Development Workflow

### Daily Development Flow

1. **Start Services**
   ```bash
   npm run dev
   ```

2. **Watch Logs**
   ```bash
   # In separate terminals
   tail -f test-middleware-deploy/logs/dev.log
   tail -f test-mcp-deploy/logs/worker.log
   ```

3. **Run Tests**
   ```bash
   # All tests
   npm test

   # Watch mode
   cd test-middleware-deploy && npm run test:watch
   ```

4. **Check Types**
   ```bash
   npm run typecheck
   ```

### Debugging Tips

1. **Enable Debug Logging**
   ```bash
   DEBUG=* npm run dev
   ```

2. **Inspect Network Traffic**
   ```bash
   # Monitor middleware requests
   curl http://localhost:3000/healthz

   # Test MCP schema
   curl http://localhost:8787/mcp/schema
   ```

3. **Use Chrome DevTools**
   - For Node.js: `node --inspect server.js`
   - For Next.js: Built-in with `npm run dev`

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

2. **Module Not Found**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript Errors**
   ```bash
   # Rebuild TypeScript
   cd test-middleware-deploy
   rm -rf dist
   npm run build
   ```

4. **Wrangler Issues**
   ```bash
   # Update wrangler
   npm install -g wrangler@latest
   
   # Clear wrangler cache
   rm -rf .wrangler
   ```

### Performance Optimization

1. **Use Turbopack** (Next.js)
   ```json
   {
     "scripts": {
       "dev": "next dev --turbopack"
     }
   }
   ```

2. **Enable SWC** (TypeScript)
   ```json
   {
     "devDependencies": {
       "@swc/core": "^1.3.0",
       "@swc/cli": "^0.1.0"
     }
   }
   ```

3. **Use Concurrent Testing**
   ```bash
   # Run tests in parallel
   npm run test -- --parallel
   ```

## Next Steps

- Review [API Documentation](../api-reference/index.md)
- Set up [CI/CD Pipeline](../ci-cd/local-testing.md)
- Configure [IDE Integration](./installation-vscode.md)
- Learn [Best Practices](../best-practices/development.md)