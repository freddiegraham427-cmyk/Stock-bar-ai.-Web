import { Logo } from '@/components/Logo';
import { useAuth } from '@/lib/auth-context';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  onNavigate: (page: 'landing' | 'signin' | 'signup') => void;
}

export function Navbar({ onNavigate }: Props) {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-ink-100' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button onClick={() => onNavigate('landing')}>
            <Logo />
          </button>

          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => scrollTo('features')} className="px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              Features
            </button>
            <button onClick={() => scrollTo('pricing')} className="px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              How It Works
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={() => onNavigate('signup')} className="hidden sm:flex btn-primary !px-4 !py-2 text-sm">
                Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => onNavigate('signin')} className="hidden sm:block btn-ghost text-sm">
                  Login
                </button>
                <button onClick={() => onNavigate('signup')} className="hidden sm:flex btn-primary !px-4 !py-2 text-sm">
                  Start Free
                </button>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-ink-100">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-ink-100 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            <button onClick={() => scrollTo('features')} className="block w-full text-left py-2 text-ink-600 font-medium">Features</button>
            <button onClick={() => scrollTo('pricing')} className="block w-full text-left py-2 text-ink-600 font-medium">Pricing</button>
            <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left py-2 text-ink-600 font-medium">How It Works</button>
            <div className="pt-2 border-t border-ink-100 flex flex-col gap-2">
              {user ? (
                <button onClick={() => { onNavigate('signup'); setMobileOpen(false); }} className="btn-primary w-full">Dashboard</button>
              ) : (
                <>
                  <button onClick={() => { onNavigate('signin'); setMobileOpen(false); }} className="btn-secondary w-full">Login</button>
                  <button onClick={() => { onNavigate('signup'); setMobileOpen(false); }} className="btn-primary w-full">Start Free</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
