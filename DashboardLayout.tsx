import { Logo } from '@/components/Logo';
import { useAuth } from '@/lib/auth-context';
import type { TabId } from '@/lib/types';
import { LayoutDashboard, PackagePlus, ShoppingCart, Boxes, CreditCard, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onSignOut: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'supply', label: 'Supply Log', icon: PackagePlus },
  { id: 'sales', label: 'Sales Log', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ activeTab, onTabChange, onSignOut, children }: Props) {
  const { profile } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const planBadge = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-ink-100 text-ink-600',
      starter: 'bg-accent-100 text-accent-700',
      pro: 'bg-brand-100 text-brand-700',
      enterprise: 'bg-warning-100 text-warning-700',
    };
    return colors[plan] || colors.free;
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-950 flex flex-col transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-ink-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-bold text-white">
              Bar<span className="text-brand-500">Stock</span>
            </span>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden text-ink-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full ${
                activeTab === item.id
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'text-ink-400 hover:bg-ink-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-800">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-error-500/10 hover:text-error-400 transition-all w-full"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileSidebarOpen && (
        <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-ink-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-ink-100">
              <Menu className="h-5 w-5 text-ink-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-ink-900 truncate max-w-[200px] sm:max-w-none">
                {profile?.business_name || 'My Business'}
              </h1>
              <p className="text-xs text-ink-500 hidden sm:block">{today}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${planBadge(profile?.plan || 'free')}`}>
              {profile?.plan || 'free'} plan
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
              {(profile?.business_name || 'B').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
