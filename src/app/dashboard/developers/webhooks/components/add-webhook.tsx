'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import { MutateWebhook } from './mutate-webhook';

import { Button } from '@/components/ui/button';

export function AddWebhook() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" variant="default" onClick={() => setOpen(true)}>
        <Plus /> Add Webhook
      </Button>

      <MutateWebhook open={open} setOpen={setOpen} />
    </>
  );
}
