import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  className?: string;
  className2?: string;
  headerTag?: string;
}

const FAQ = ({
  className = '',
  className2 = '',
  headerTag = 'h2',
}: FAQProps) => {
  const items: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'What is Xano AI Developer?',
      answer:
        'Xano AI Developer is your personal AI assistant that builds APIs, manages databases, and creates workflows directly in your Xano workspace. It works with Claude.ai, ChatGPT, Copilot, and any AI you prefer - transforming natural language into production-ready Xano backends.',
    },
    {
      id: 'faq-2',
      question: 'How secure is my data?',
      answer:
        "Your data security is our top priority. All connections use OAuth 2.0 and API key authentication, your Xano workspace remains isolated, and AI only builds what you explicitly request. We follow Xano's security best practices and never store your data.",
    },
    {
      id: 'faq-3',
      question: 'Do I need to change my Xano setup?',
      answer:
        'No! Xano AI Developer works with your existing Xano workspace exactly as it is. No migration, no new platform to learn, no changes to your current APIs. Just connect and start building faster with AI assistance.',
    },
    {
      id: 'faq-4',
      question: 'What can AI build in my Xano workspace?',
      answer:
        'AI can create complete API endpoints, design database schemas, implement authentication flows, set up background tasks, create webhooks, build complex queries with joins and aggregations, add input validation, and implement error handling - all following Xano best practices.',
    },
    {
      id: 'faq-5',
      question: 'How much control do I have?',
      answer:
        'You have complete control. AI shows you exactly what it plans to build before creating anything. You can review, modify, or reject any suggestion. All changes happen in your Xano workspace where you can see, test, and roll back anything.',
    },
    {
      id: 'faq-6',
      question: 'Does it work with my Xano plan?',
      answer:
        'Xano AI Developer works with all Xano plans - Starter, Launch, Scale, and Enterprise. The AI adapts to your plan limits and available features, always building within your workspace capabilities.',
    },
    {
      id: 'faq-7',
      question: 'How fast can AI build?',
      answer:
        'AI typically creates a complete API endpoint in under 30 seconds. Complex workflows with multiple tables and external integrations take 1-2 minutes. You save hours compared to manual development, with better error handling and optimization built in.',
    },
    {
      id: 'faq-8',
      question: 'Can I use my preferred AI tool?',
      answer:
        "Yes! Xano AI Developer works with Claude.ai, ChatGPT, GitHub Copilot, Cursor, and any AI assistant that supports MCP or custom tools. Use the AI you're already comfortable with to build in Xano.",
    },
    {
      id: 'faq-9',
      question: 'How do I get started?',
      answer:
        'Getting started takes less than 2 minutes: 1) Connect your Xano workspace, 2) Authenticate with OAuth or API key, 3) Open your favorite AI tool, and 4) Start describing what you want to build. The AI handles the rest.',
    },
    {
      id: 'faq-10',
      question: 'What if I need help or support?',
      answer:
        'We offer comprehensive support including Xano-specific documentation, video tutorials showing real builds, community Discord, and priority support for teams. Our experts understand both Xano and AI, ensuring you get the best of both worlds.',
    },
  ];

  return (
    <section className={`py-16 lg:py-24 ${className}`.trim()}>
      <div className={`container max-w-3xl ${className2}`.trim()}>
        <div className="mb-16 text-center">
          {React.createElement(
            headerTag,
            { className: 'mb-4 text-3xl font-semibold md:text-4xl' },
            'Frequently Asked Questions'
          )}
          <p className="text-muted-foreground text-lg">
            Everything you need to know about Xano AI Developer
          </p>
        </div>
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { FAQ };
