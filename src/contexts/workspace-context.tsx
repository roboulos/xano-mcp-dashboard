'use client';

import React, { createContext, useContext, useState } from 'react';

interface Workspace {
  id: number;
  name: string;
  slug: string;
  owner_id: string;
  subscription_plan: string;
  status: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  loading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

// Dummy workspace data for now - replace with API call later
const DUMMY_WORKSPACES: Workspace[] = [
  {
    id: 5,
    name: 'Acme Corp Development',
    slug: 'acme-dev',
    owner_id: '17b6fc02-966c-4642-babe-e8004afffc46',
    subscription_plan: 'pro',
    status: 'active',
  },
  {
    id: 6,
    name: 'TechFlow Solutions',
    slug: 'techflow',
    owner_id: '17b6fc02-966c-4642-babe-e8004afffc46',
    subscription_plan: 'starter',
    status: 'trial',
  },
  {
    id: 7,
    name: 'Beta Testing Environment',
    slug: 'beta-env',
    owner_id: '17b6fc02-966c-4642-babe-e8004afffc46',
    subscription_plan: 'enterprise',
    status: 'active',
  },
];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces] = useState<Workspace[]>(DUMMY_WORKSPACES);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    DUMMY_WORKSPACES[0]
  );
  const [loading] = useState(false);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
