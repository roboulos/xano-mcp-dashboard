'use client';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const FAQShadcn = () => {
  const faqs = [
    {
      question: 'What exactly is the Xano MCP Dashboard?',
      answer:
        'The Xano MCP Dashboard is a powerful interface that bridges your Xano backend with Claude AI through the Model Context Protocol (MCP). It provides real-time monitoring, configuration management, and seamless integration capabilities for your AI-powered applications.',
    },
    {
      question: 'How does the MCP integration work?',
      answer:
        'MCP (Model Context Protocol) enables Claude AI to interact directly with your Xano database and APIs. Our dashboard manages these connections, handles authentication, monitors performance, and provides a visual interface for configuration and troubleshooting.',
    },
    {
      question: 'Do I need coding experience to use this?',
      answer:
        'While basic understanding of APIs and databases is helpful, our dashboard is designed to be user-friendly. We provide guided setup, pre-built templates, and comprehensive documentation. Plus, our Pro tier includes weekly strategy calls for personalized guidance.',
    },
    {
      question: "What's included in the Free tier?",
      answer:
        "The Free tier gives you read-only dashboard access, one MCP configuration, full documentation access, and community support. It's perfect for exploring the platform and understanding how it can benefit your projects before upgrading.",
    },
    {
      question: 'How quickly can I get started?',
      answer:
        "Most users have their first MCP connection running within 15 minutes. We provide step-by-step setup guides, video tutorials, and if you're on the Pro tier, you can schedule an onboarding call for immediate assistance.",
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. We use industry-standard encryption for all data transmission, never store your Xano credentials, and all connections are made directly between your services. Our dashboard acts as a configuration and monitoring layer, not a data intermediary.',
    },
    {
      question: 'Can I cancel or change plans anytime?',
      answer:
        'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle, and we offer a 14-day money-back guarantee for Pro subscriptions.',
    },
    {
      question: 'What kind of support do you offer?',
      answer:
        'Free tier users get community support through our Discord. Pro users receive priority email support with 24-hour response times plus weekly 30-minute strategy calls. Team tier includes dedicated support with 1-hour response times.',
    },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Everything you need to know about the Xano MCP Dashboard. Can't
              find what you're looking for?
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact" className="group">
                Contact our support team
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FAQShadcn };
