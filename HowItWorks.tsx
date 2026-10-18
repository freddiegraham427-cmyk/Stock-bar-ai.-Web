import { Package, DollarSign, Wallet, BrainCircuit } from 'lucide-react';

const STEPS = [
  { icon: Package, title: 'Log Your Supply', description: 'Enter every delivery: product, quantity, cost, and supplier. BarStock AI tracks it automatically.' },
  { icon: DollarSign, title: 'Record Your Sales', description: 'Each sale logs the product, quantity, price, and payment method. Stock updates in real-time.' },
  { icon: Wallet, title: 'Balance Cash & Transfers', description: 'See your cash vs transfer split instantly. Reconcile at end of day in seconds, not hours.' },
  { icon: BrainCircuit, title: 'Let AI Do The Thinking', description: 'AI analyzes demand, predicts what to restock, and forecasts your profit. You just run your business.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-brand-500 uppercase tracking-wider">How it works</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            From chaos to clarity in 4 simple steps
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-brand-300 to-transparent" />
              )}

              <div className="relative card p-6 text-center hover:shadow-lg transition-all">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
                  <step.icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>

                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ink-900 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                  {i + 1}
                </div>

                <h3 className="mt-4 text-lg font-bold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
