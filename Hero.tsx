import { ArrowRight, TrendingUp, Package, DollarSign, BrainCircuit, BarChart3, Wallet, ShoppingCart } from 'lucide-react';

interface Props {
  onStartFree: () => void;
}

export function Hero({ onStartFree }: Props) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-ink-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950/40" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
              <BrainCircuit className="h-4 w-4" />
              AI-Powered Business Management
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Stop Losing Stock & Cash.
              <span className="block mt-2 bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                Track Every Drink, Food & Sale with AI
              </span>
            </h1>

            <p className="mt-6 text-lg text-ink-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              BarStock AI helps eateries, bars & restaurants monitor supply, track sales, balance cash vs transfers, and predict demand — all from one beautiful dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button onClick={onStartFree} className="btn-primary group text-base">
                Start Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
                See Features
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-ink-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse-soft" />
                <span className="text-sm">No credit card needed</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                <span className="text-sm">Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Preview Card */}
          <div className="relative animate-fade-in-up animate-delay-200">
            <div className="relative rounded-2xl bg-ink-900/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-error-500/80" />
                <div className="w-3 h-3 rounded-full bg-warning-500/80" />
                <div className="w-3 h-3 rounded-full bg-success-500/80" />
                <span className="ml-2 text-xs text-ink-400 font-medium">BarStock AI Dashboard</span>
              </div>

              {/* KPI cards row */}
              <div className="p-4 grid grid-cols-3 gap-3">
                {[
                  { icon: DollarSign, label: 'Sales', value: '$1,240', color: 'text-brand-400', bg: 'bg-brand-500/10' },
                  { icon: Wallet, label: 'Cash', value: '$780', color: 'text-success-500', bg: 'bg-success-500/10' },
                  { icon: ShoppingCart, label: 'Transfer', value: '$460', color: 'text-accent-400', bg: 'bg-accent-500/10' },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl bg-ink-800/80 p-3 border border-white/5">
                    <div className={`flex items-center gap-1.5 ${kpi.color}`}>
                      <kpi.icon className="h-4 w-4" />
                      <span className="text-xs font-medium text-ink-400">{kpi.label}</span>
                    </div>
                    <p className="mt-1.5 text-lg font-bold text-white">{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className="px-4 pb-4">
                <div className="rounded-xl bg-ink-800/80 p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-ink-400">Sales Trend</span>
                    <div className="flex items-center gap-1 text-success-500">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-semibold">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 60, 35, 80, 55, 95, 70].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-500" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Analysis bar */}
              <div className="px-4 pb-4">
                <div className="rounded-xl bg-gradient-to-r from-brand-500/10 to-accent-500/10 p-3 border border-brand-500/20 flex items-center gap-3">
                  <BrainCircuit className="h-5 w-5 text-brand-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">AI Demand Analysis</p>
                    <p className="text-xs text-ink-400">Star Beer trending up — restock tomorrow</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat badge */}
            <div className="absolute -top-4 -right-4 rounded-xl bg-white shadow-xl px-4 py-2 animate-float hidden sm:block">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-bold text-ink-900">+18% Profit</span>
              </div>
            </div>

            {/* Floating stock badge */}
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-white shadow-xl px-4 py-2 animate-float hidden sm:block" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-accent-500" />
                <span className="text-sm font-bold text-ink-900">Stock: 248 items</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
