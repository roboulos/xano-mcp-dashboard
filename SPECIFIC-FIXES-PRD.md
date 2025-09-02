# SPECIFIC FIXES PRD - Xano MCP Dashboard MVP Completion
## Tunnel Vision: The Final 20% in Concrete Steps

### Overview
Four critical tasks remain. Each task builds on the previous. No deviations. No enhancements. Just these four tasks to MVP.

---

## TASK 1: Create Xano GET /api:4ir_LaU4/members Endpoint
**Time: 30 minutes**

### Step 1.1: Open Xano Dashboard
- Navigate to Workspace 5
- Go to API Group with prefix `4ir_LaU4`
- Click "Add API Endpoint"
- Method: GET, Path: `/members`
- Enable Authentication

### Step 1.2: Add Function Stack
1. **Add Code Step** (JavaScript)
   - Copy this EXACT code:

```javascript
const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 50;

function badRequest(status, code, message, details) {
  return {
    status: status,
    body: {
      error: {
        code,
        message,
        details: details || {}
      }
    }
  };
}

try {
  // 1) Auth + workspace validation
  if (!auth || !auth.user || !auth.user.workspace_id) {
    return badRequest(401, "AUTH_REQUIRED", "Authentication required or workspace missing in token");
  }
  const workspace_id = auth.user.workspace_id;

  // 2) Pagination inputs
  const page = Number(input.page || PAGE_DEFAULT);
  const limit = Math.min(Number(input.limit || LIMIT_DEFAULT), 200);

  // 3) Query workspace_members
  const membersPaged = db.query("workspace_members", {
    where: { workspace_id: workspace_id },
    order: { created_at: "desc" },
    page: page,
    limit: limit
  });
  const members = membersPaged.items || [];
  const total = membersPaged.total || 0;

  // 4) Collect user_ids and fetch user profiles
  const userIds = members.map(m => m.user_id).filter(Boolean);
  let usersById = {};
  if (userIds.length > 0) {
    const users = db.query('👤 users', {
      where: { id: { in: userIds } },
      select: ["id", "email", "name", "avatar_url"]
    });
    usersById = users.reduce((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});
  }

  // 5) Fetch xano_api_keys
  const xanoCreds = db.query("xano_api_keys", {
    where: {
      workspace_id: workspace_id,
      status: { in: ["active", "revoked"] }
    },
    select: [
      "id", "name", "environment", "status", "key_prefix",
      "assigned_to_members", "last_used_at", "usage_count", "created_at"
    ],
    limit: 10000
  });

  // 6) Build assigned_credentials per member
  function buildAssignments(memberUserId) {
    const assigned = [];
    for (const c of xanoCreds) {
      const assignedArray = Array.isArray(c.assigned_to_members) ? c.assigned_to_members : [];
      if (assignedArray.indexOf(memberUserId) !== -1) {
        assigned.push({
          id: c.id,
          name: c.name,
          type: "xano",
          key_prefix: c.key_prefix || "",
          assigned_at: c.created_at || null,
          last_used_at: c.last_used_at || null
        });
      }
    }
    return assigned;
  }

  // 7) Assemble final payload
  const out = members.map(m => {
    const user = usersById[m.user_id] || null;
    return {
      id: m.id,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url || null
      } : {
        id: m.user_id,
        email: null,
        name: null,
        avatar_url: null
      },
      role: m.role,
      status: m.status,
      joined_at: m.created_at,
      last_active_at: m.last_active_at || null,
      assigned_credentials: buildAssignments(m.user_id)
    };
  });

  return {
    status: 200,
    body: {
      members: out,
      total: total
    }
  };
} catch (err) {
  return badRequest(500, "SERVER_ERROR", "Failed to list members", { message: String(err && err.message || err) });
}
```

2. **Add Response Step**
   - Type: "Set Response"
   - Value: Use output from Code step

### Step 1.3: Test the Endpoint
- Use Xano's "Run & Debug"
- Should return members array with assigned_credentials

**Connects to:** Frontend `/api/members` proxy route (TASK 5)

---

## TASK 2: Add Encryption Service to Next.js
**Time: 20 minutes**

### Step 2.1: Generate Encryption Key
Run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 2.2: Add to Environment
Edit `/Users/sboulos/Desktop/ai_projects/xano-mcp-dashboard/.env.local`:
```
MCP_CRYPTO_KEY_B64=YOUR_GENERATED_KEY_HERE
```

### Step 2.3: Create Encryption Library
Create file `/Users/sboulos/Desktop/ai_projects/xano-mcp-dashboard/src/lib/crypto.ts`:

```typescript
import crypto from 'crypto';

const KEY_B64 = process.env.MCP_CRYPTO_KEY_B64 || '';
if (!KEY_B64) throw new Error('MCP_CRYPTO_KEY_B64 is not set');
const KEY = Buffer.from(KEY_B64, 'base64');
if (KEY.length !== 32) throw new Error('MCP_CRYPTO_KEY_B64 must decode to 32 bytes');

export function encryptSecret(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ['v1', iv.toString('base64'), ciphertext.toString('base64'), tag.toString('base64')].join('.');
}

export function decryptSecret(payload: string): string {
  const parts = payload.split('.');
  if (parts.length !== 4) throw new Error('Invalid ciphertext format');
  const [version, ivB64, ctB64, tagB64] = parts;
  if (version !== 'v1') throw new Error('Unsupported ciphertext version');

  const iv = Buffer.from(ivB64, 'base64');
  const ct = Buffer.from(ctB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ct), decipher.final()]);
  return plaintext.toString('utf8');
}
```

**Connects to:** Credential creation (TASK 3) and MCP token retrieval (TASK 4)

---

## TASK 3: Update Xano mcp-token Endpoint to Return Ciphertext
**Time: 15 minutes**

### Step 3.1: Modify Xano POST /api:4ir_LaU4/auth/mcp-token
Navigate to endpoint ID: 17900 in Xano

### Step 3.2: Update Response Structure
Find where it returns the credential and change:
- FROM: `api_key: record.api_key`
- TO: `key_ciphertext: record.key_ciphertext`

The response should look like:
```javascript
return {
  status: 200,
  body: {
    credential: {
      id: credential.id,
      name: credential.name,
      type: credential.type,
      key_ciphertext: credential.key_ciphertext, // Changed from api_key
      instance_url: credential.instance_url,
      environment: credential.environment,
      metadata: credential.metadata || {}
    },
    issued_at: new Date().toISOString(),
    usage: {
      count_today: 0,
      count_this_month: 0
    }
  }
};
```

**Connects to:** Next.js MCP token endpoint (TASK 4)

---

## TASK 4: Create Next.js MCP Token Endpoint with Decryption
**Time: 15 minutes**

### Step 4.1: Create MCP Token Route
Create file `/Users/sboulos/Desktop/ai_projects/xano-mcp-dashboard/src/app/api/mcp/auth/token/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { decryptSecret } from '@/lib/crypto';

const XANO_BASE = process.env.XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io';

export async function POST(request: NextRequest) {
  try {
    // Forward to Xano to get ciphertext
    const response = await fetch(`${XANO_BASE}/api:4ir_LaU4/auth/mcp-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || ''
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Decrypt the API key
    if (!data?.credential?.key_ciphertext) {
      return NextResponse.json({
        error: { code: 'SERVER_ERROR', message: 'Missing key_ciphertext from backend' }
      }, { status: 500 });
    }

    const api_key = decryptSecret(data.credential.key_ciphertext);

    // Return with decrypted key
    return NextResponse.json({
      credential: {
        id: data.credential.id,
        name: data.credential.name,
        type: data.credential.type,
        api_key, // Decrypted key ONLY returned here
        instance_url: data.credential.instance_url || null,
        environment: data.credential.environment,
        metadata: data.credential.metadata || {}
      },
      issued_at: data.issued_at,
      expires_at: data.expires_at || null,
      usage: data.usage || { count_today: 0, count_this_month: 0 }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: { code: 'SERVER_ERROR', message: error?.message || 'Failed to retrieve credential' }
    }, { status: 500 });
  }
}
```

**Connects to:** Developer documentation (TASK 7)

---

## TASK 5: Create Members API Proxy Route
**Time: 10 minutes**

### Step 5.1: Create Members Route
Create file `/Users/sboulos/Desktop/ai_projects/xano-mcp-dashboard/src/app/api/members/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const XANO_BASE = process.env.XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io';

export async function GET(request: NextRequest) {
  const authToken = cookies().get('authToken')?.value;
  
  if (!authToken) {
    return NextResponse.json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' }
    }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const url = `${XANO_BASE}/api:4ir_LaU4/members${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

**Connects to:** Members page UI (TASK 6)

---

## TASK 6: Create Members Page UI
**Time: 30 minutes**

### Step 6.1: Create Members Page
Create file `/Users/sboulos/Desktop/ai_projects/xano-mcp-dashboard/src/app/dashboard/members/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { UserPlus, X, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

interface Member {
  id: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
  role: string;
  status: string;
  assigned_credentials: Array<{
    id: number;
    name: string;
    type: string;
    key_prefix: string;
  }>;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data.members);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
          <CardDescription>
            Manage workspace members and their API credential access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Credentials</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.assigned_credentials.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        No credentials assigned
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {member.assigned_credentials.map((cred) => (
                          <div key={cred.id} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {cred.type}
                            </Badge>
                            <span className="text-sm">{cred.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({cred.key_prefix}...)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Connects to:** Credential assignment (Future - post MVP)

---

## TASK 7: Create Developer Documentation Page
**Time: 15 minutes**

### Step 7.1: Create Developers Page
Create file `/Users/sboulos/Desktop/ai_projects/xano-mcp-dashboard/src/app/dashboard/developers/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Copy, Check, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DevelopersPage() {
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.your-dashboard.com';

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const authExample = `// Authenticate to retrieve your assigned credential
const response = await fetch('${baseUrl}/api/mcp/auth/token', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_MCP_USER_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
const credential = data.credential;

// Use the API key for your service
console.log(credential.api_key); // The decrypted API key`;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Developer Integration</h2>
        <p className="text-muted-foreground">
          Integrate your MCP tools with the credential system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            MCP Token Retrieval
          </CardTitle>
          <CardDescription>
            Use your MCP token to retrieve assigned credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-muted-foreground">Authentication Example</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(authExample)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code>{authExample}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="curl" className="w-full">
        <TabsList>
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
        </TabsList>
        <TabsContent value="curl">
          <Card>
            <CardContent className="pt-6">
              <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                <code>{`curl -X POST ${baseUrl}/api/mcp/auth/token \\
  -H "Authorization: Bearer YOUR_MCP_USER_TOKEN" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="javascript">
          <Card>
            <CardContent className="pt-6">
              <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                <code>{authExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="python">
          <Card>
            <CardContent className="pt-6">
              <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                <code>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_MCP_USER_TOKEN',
    'Content-Type': 'application/json'
}

response = requests.post(
    '${baseUrl}/api/mcp/auth/token',
    headers=headers
)

credential = response.json()['credential']
api_key = credential['api_key']`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Connects to:** MCP tools using the system

---

## TASK 8: Create Credentials API Routes
**Time: 20 minutes**

### Step 8.1: Create Credentials List Route
Create file `/Users/sboulos/Desktop/ai_projects/xano-mcp-dashboard/src/app/api/credentials/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encryptSecret } from '@/lib/crypto';

const XANO_BASE = process.env.XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io';

export async function GET(request: NextRequest) {
  const authToken = cookies().get('authToken')?.value;
  
  if (!authToken) {
    return NextResponse.json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' }
    }, { status: 401 });
  }

  const response = await fetch(`${XANO_BASE}/api:4ir_LaU4/credentials`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  const authToken = cookies().get('authToken')?.value;
  
  if (!authToken) {
    return NextResponse.json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' }
    }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, type, api_key, description, instance_url, environment, metadata } = body;
    
    if (!name || !type || !api_key || !environment) {
      return NextResponse.json({
        error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' }
      }, { status: 400 });
    }

    const key_prefix = api_key.slice(0, 8);
    const key_ciphertext = encryptSecret(api_key);

    const response = await fetch(`${XANO_BASE}/api:4ir_LaU4/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name,
        type,
        description,
        instance_url,
        environment,
        metadata,
        key_prefix,
        key_ciphertext
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({
      error: { code: 'SERVER_ERROR', message: error?.message || 'Failed to create credential' }
    }, { status: 500 });
  }
}
```

### Step 8.2: Update Xano Create Credential Endpoint
Navigate to POST /api:4ir_LaU4/credentials (ID: 17895) and update to:
1. Accept `key_ciphertext` instead of `api_key`
2. Store `key_ciphertext` in the database
3. Never log or expose the ciphertext

**Connects to:** Credentials page UI

---

## COMPLETION CHECKLIST

After completing these 8 tasks, test the full flow:

1. ✓ Navigate to `/dashboard/members` - should show members list
2. ✓ Create a credential via API - should encrypt the key
3. ✓ Call `/api/mcp/auth/token` with auth header - should return decrypted key
4. ✓ Check `/dashboard/developers` - should show integration docs

## What's NOT in MVP:
- Credential assignment UI (button exists but no dialog)
- Member invitation flow
- Activity logging
- Usage analytics
- Credential editing
- Rate limiting

These 8 tasks complete the MVP. Ship it.