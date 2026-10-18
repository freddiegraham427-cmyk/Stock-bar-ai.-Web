import { TrendingUp, Users, Store, Boxes } from 'lucide-react';

const STATS = [
  { icon: Store, label: 'Businesses powered', value: '500+' },
  { icon: TrendingUp, label: 'Avg. profit increase', value: '18%' },
  { icon: Boxes, label: 'Items tracked daily', value: '50K+' },
  { icon: Users, label: 'Active staff users', value: '1,200+' },
];

export function StatsBar() {
  return (
    <section className="py-12 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 mb-3">
                <stat.icon className="h-5 w-5 text-brand-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-ink-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
