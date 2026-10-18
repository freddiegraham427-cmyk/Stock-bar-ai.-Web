import { PLANS, getCheckoutUrl } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (page: 'landing' | 'signin' | 'signup') => void;
  onSelectPlan?: (planId: string) => void;
}

export function Pricing({ onNavigate }: Props) {
  const { user } = useAuth();
  const [yearly, setYearly] = useState(false);

  const handlePlanClick = (planId: string, checkoutKey?: string) => {
    if (planId === 'free') {
      onNavigate('signup');
      return;
    }
    if (!user) {
      onNavigate('signup');
      return;
    }
    if (checkoutKey) {
      const url = getCheckoutUrl(checkoutKey);
      if (url) {
        window.location.href = url;
      }
    }
  };

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-ink-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-brand-500 uppercase tracking-wider">Pricing</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            Simple pricing that grows with you
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white rounded-full p-1 border border-ink-200 shadow-sm">
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
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-success-500/10 text-success-600 font-bold">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative card p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted ? 'ring-2 ring-brand-500 shadow-xl scale-105' : 'hover:shadow-lg'
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

              {plan.id === 'free' ? (
                <button
                  onClick={() => handlePlanClick(plan.id)}
                  className={`ls-button ${plan.highlighted ? 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25' : 'bg-ink-900 text-white hover:bg-ink-800'}`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={user ? (getCheckoutUrl(plan.checkoutKey!) || '#') : undefined}
                  onClick={(e) => {
                    if (!user || !getCheckoutUrl(plan.checkoutKey!)) {
                      e.preventDefault();
                      handlePlanClick(plan.id, plan.checkoutKey);
                    }
                  }}
                  className={`ls-button ${plan.highlighted ? 'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25' : 'bg-ink-900 text-white hover:bg-ink-800'}`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink-400">
          All plans include secure Supabase authentication, data encryption, and 99.9% uptime.
        </p>
      </div>
    </section>
  );
}
