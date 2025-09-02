// Billing configuration
export const BILLING_CONFIG = {
  stripe: {
    // These should match your actual Stripe price IDs
    prices: {
      pro_monthly: 'price_1QUXqKLKZqZqZqZqZqZqZqZq', // TODO: Replace with actual Stripe price ID
      team_monthly: 'price_1QUXqLLKZqZqZqZqZqZqZqZq', // TODO: Replace with actual Stripe price ID
    },
  },
  plans: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Dashboard Access (Read-only)',
        '1 MCP Configuration',
        'Documentation',
        'Community Support',
      ],
    },
    pro: {
      name: 'Pro',
      price: 199,
      features: [
        'Dashboard Access (Full)',
        'Unlimited MCP Configurations',
        'Documentation',
        'Community Support',
        'Weekly Strategy Calls',
        'Priority Support',
      ],
    },
    team: {
      name: 'Team',
      price: 'custom',
      features: [
        'Dashboard Access (Full team)',
        'Unlimited MCP Configurations',
        'Documentation',
        'Community Support',
        'Weekly Strategy Calls',
        'Priority Support (1-hour response)',
        'Team Management',
        'Custom Onboarding',
      ],
    },
  },
};
