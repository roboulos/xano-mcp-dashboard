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
        'Start with read-only credentials if you want (like West\'s healthcare team did). OAuth 2.0 when you\'re ready. Work in a branch to test safely. We never store your Xano data - everything runs through your own API keys. Nick from Australia even booked a call first because it "seemed too good to be true."',
    },
    {
      id: 'faq-3',
      question: 'What makes this different from other AI tools?',
      answer:
        'TypeScript SDK with guardrails + middleware feedback loop. While other tools generate broken XanoScript with green expressions everywhere, ours uses Xano filters properly, leverages all 200+ operations, and gives the AI actual error feedback to fix issues. Result: "80-90% first-try success" (Robert).',
    },
    {
      id: 'faq-4',
      question: "Who's actually using this?",
      answer:
        'Luke builds client platforms (even from a pool in Greece on his phone). Shane cut 4-hour tasks to 2 minutes. Nick runs automation in Australia. West & John use it for healthcare systems. Developers who tried building their own MCP tools switched to this. Even Ray Deck uses and recommends it.',
    },
    {
      id: 'faq-5',
      question: 'What are MCP Wednesday calls?',
      answer:
        "Weekly live sessions where Robert builds endpoints, answers questions, and shows new techniques. Luke, Shane, West, Ray and others regularly attend. You'll see real builds, real problems solved, real results. Not marketing - actual development.",
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
