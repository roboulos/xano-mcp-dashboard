import React from 'react';

import { EvervaultCard } from '@/components/aceternity/evervault-card';

const Feature282 = () => {
  return (
    <section className="w-screen overflow-hidden py-32">
      <div className="container grid h-full w-full grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <div className="bg-primary border-primary/20 mx-auto flex h-full w-full flex-col gap-4 rounded-lg border p-4 md:max-w-sm">
            <div className="bg-background border-border/50 h-full w-full rounded-md border p-4">
              <EvervaultCard
                text="Hover to Encrypt"
                className="w-full text-center text-xl font-medium tracking-tight"
              />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-muted-foreground font-mono text-sm">
                AES-256 Encryption
              </p>
              <p className="text-primary-foreground text-lg font-semibold">
                Block-Grade Security
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-muted-foreground mb-2 font-mono text-sm">
            Enterprise Security Solutions
          </h2>
          <h2 className="text-3xl font-semibold tracking-tight md:max-w-lg">
            Advanced Encryption Technology for Modern Applications
          </h2>
          <p className="text-muted-foreground mt-6 leading-relaxed md:max-w-lg">
            Our encryption infrastructure utilizes state-of-the-art
            cryptographic algorithms to ensure your data remains secure at rest
            and in transit. With AES-256 encryption, RSA key exchange, and
            perfect forward secrecy, we provide enterprise-grade protection for
            your most sensitive information.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed md:max-w-lg">
            Built with zero-knowledge architecture, our security framework
            ensures that only authorized users can access encrypted data.
            Multi-layer authentication, hardware security modules, and
            continuous monitoring provide comprehensive protection against
            modern security threats.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-2 w-2 rounded-full"></div>
              <span className="text-muted-foreground font-mono text-sm">
                256-bit encryption keys
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary h-2 w-2 rounded-full"></div>
              <span className="text-muted-foreground font-mono text-sm">
                End-to-end encryption
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary h-2 w-2 rounded-full"></div>
              <span className="text-muted-foreground font-mono text-sm">
                Zero-knowledge architecture
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export { Feature282 };
