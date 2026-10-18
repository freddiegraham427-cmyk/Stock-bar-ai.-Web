import { Logo } from '@/components/Logo';
import { Wine, Mail, Twitter, Github, Linkedin } from 'lucide-react';

interface Props {
  onNavigate: (page: 'landing' | 'signin' | 'signup') => void;
}

export function Footer({ onNavigate }: Props) {
  return (
    <footer className="bg-ink-950 border-t border-ink-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
                <Wine className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Bar<span className="text-brand-500">Stock</span> <span className="text-ink-400 font-medium text-lg">AI</span>
              </span>
            </div>
            <p className="text-sm text-ink-400 max-w-sm leading-relaxed">
              AI-powered business management for eateries, bars & restaurants. Track every drink, food, and sale — stop losing stock and cash.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-ink-400 hover:bg-brand-500 hover:text-white transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-ink-400 hover:text-brand-400 transition-colors">Features</button></li>
              <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-ink-400 hover:text-brand-400 transition-colors">Pricing</button></li>
              <li><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-ink-400 hover:text-brand-400 transition-colors">How It Works</button></li>
              <li><button onClick={() => onNavigate('signup')} className="text-ink-400 hover:text-brand-400 transition-colors">Start Free</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-ink-400 hover:text-brand-400 transition-colors">About</a></li>
              <li><a href="#" className="text-ink-400 hover:text-brand-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-ink-400 hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-ink-400 hover:text-brand-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-500">© 2026 BarStock AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Mail className="h-4 w-4" />
            <span>support@barstock.ai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
