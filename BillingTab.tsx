import { useState } from 'react';
import { PLANS, getCheckoutUrl } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { Check, Sparkles, CreditCard, Crown, ArrowRight } from 'lucide-react';

export function BillingTab() {
  const { profile } = useAuth();
  const [yearly, setYearly] = useState(false);

  const currentPlan = profile?.plan || 'free';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
          <CreditCard className="h-5 w-5 text-brand-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900">Billing & Plans</h2>
          <p className="text-sm text-ink-500">Manage your subscription and payment method</p>
        </div>
      </div>

      {/* Current plan card */}
      <div className="card p-6 bg-gradient-to-r from-brand-50 to-accent-50 border-brand-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Current Plan</p>
              <p className="text-2xl font-extrabold text-ink-900 capitalize">{currentPlan}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-500">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse-soft" />
              <span className="font-semibold text-success-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-3 bg-white rounded-full p-1 border border-ink-200 shadow-sm">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!yearly ? 'bg-brand-500 text-white shadow-md' : 'text-ink-600 hover:text-ink-900'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${yearly ? 'bg-brand-500 text-white shadow-md' : 'text-ink-600 hover:text-ink-900'}`}
          >
            Yearly
            <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-success-500/10 text-success-600 font-bold">20% OFF</span>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const checkoutUrl = plan.checkoutKey ? getCheckoutUrl(plan.checkoutKey) : undefined;

          return (
            <div
              key={plan.id}
              className={`relative card p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted ? 'ring-2 ring-brand-500 shadow-xl' : 'hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    POPULAR
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-ink-900">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-ink-900">
                    ${yearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  <span className="text-sm text-ink-500">/{yearly ? 'year' : 'mo'}</span>
                </div>
                {yearly && plan.priceMonthly > 0 && (
                  <p className="mt-1 text-xs text-success-600 font-medium">
                    Save ${(plan.priceMonthly * 12 - plan.priceYearly).toLocaleString()} per year
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ink-600">
                    <Check className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="ls-button bg-ink-100 text-ink-500 cursor-default">
                  Current Plan
                </div>
              ) : plan.id === 'free' ? (
                <div className="ls-button bg-ink-900 text-white hover:bg-ink-800">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </div>
              ) : checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  className={`ls-button ${plan.highlighted ? 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25' : 'bg-ink-900 text-white hover:bg-ink-800'}`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <div className="ls-button bg-ink-100 text-ink-400 cursor-not-allowed text-sm">
                  Checkout link not configured
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-ink-400">
        All payments are processed securely via Lemon Squeezy. Cancel anytime.
      </p>
    </div>
  );
}
