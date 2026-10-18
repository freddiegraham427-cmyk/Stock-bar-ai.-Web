import { Package, DollarSign, Wallet, BrainCircuit } from 'lucide-react';

const FEATURES = [
  {
    icon: Package,
    title: 'Supply Tracking',
    description: 'Log every stock-in with product name, quantity, cost price, and supplier. Know exactly what came in and what it cost.',
    color: 'text-brand-500',
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20',
  },
  {
    icon: DollarSign,
    title: 'Sales Tracking',
    description: 'Record every sale with payment method, selling price, and quantity. See your revenue in real-time as it happens.',
    color: 'text-accent-500',
    bg: 'bg-accent-500/10',
    border: 'border-accent-500/20',
  },
  {
    icon: Wallet,
    title: 'Cash vs Transfer Balance',
    description: 'Always know how much cash vs transfers you collected. Perfect for end-of-day reconciliation and accounting.',
    color: 'text-success-500',
    bg: 'bg-success-500/10',
    border: 'border-success-500/20',
  },
  {
    icon: BrainCircuit,
    title: 'AI Demand Analysis',
    description: 'AI predicts what will sell, what needs restocking, and your expected profit. Never run out of your best sellers again.',
    color: 'text-warning-500',
    bg: 'bg-warning-500/10',
    border: 'border-warning-500/20',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-brand-500 uppercase tracking-wider">Everything you need</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            One tool to run your entire bar or restaurant
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            From the back door delivery to the customer's bill — track it all with AI-powered insights.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`group card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animate-delay-${(i + 1) * 100}`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.border} border`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
