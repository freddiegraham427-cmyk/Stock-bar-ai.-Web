import type { PlanId } from './types';

interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
  checkoutKey?: string;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['1 shop', '50 sales/month', 'Basic analytics', 'Supply tracking', 'Inventory view'],
    cta: 'Start Free',
  },
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 9,
    priceYearly: 86,
    features: ['Unlimited sales', '1 branch', 'Cash/Transfer report', 'Supply tracking', 'Inventory management', 'Email support'],
    cta: 'Buy Starter $9',
    checkoutKey: 'VITE_LEMONSQUEEZY_STARTER',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 29,
    priceYearly: 278,
    features: ['3 branches', '5 staff accounts', 'AI demand prediction', 'Daily/Weekly/Monthly analytics', 'Profit tracking', 'Priority support'],
    highlighted: true,
    cta: 'Buy Pro $29',
    checkoutKey: 'VITE_LEMONSQUEEZY_PRO',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 79,
    priceYearly: 758,
    features: ['Unlimited everything', 'Unlimited branches & staff', 'Full AI suite', 'API access', 'Custom reports', 'Dedicated manager'],
    cta: 'Buy Enterprise $79',
    checkoutKey: 'VITE_LEMONSQUEEZY_ENTERPRISE',
  },
];

export const formatUSD = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (n: number): string => {
  return n.toLocaleString('en-US');
};

export const getCheckoutUrl = (key: string): string | undefined => {
  return import.meta.env[key] as string | undefined;
};
