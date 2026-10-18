import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Mail, Lock, Wine, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  onNavigate: (page: 'landing' | 'signin' | 'signup') => void;
}

export function SignInPage({ onNavigate }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      onNavigate('signup');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950/40" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />

        <div className="relative max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-2xl shadow-brand-500/30 mb-6">
            <Wine className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Welcome back to BarStock AI</h2>
          <p className="text-ink-400 leading-relaxed">
            Your bar's intelligence dashboard is waiting. Track stock, sales, and profit — all powered by AI.
          </p>

          <div className="mt-8 space-y-3 text-left">
            {['Real-time stock tracking', 'AI demand prediction', 'Cash vs transfer balance'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-ink-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <div className="mb-8">
            <Logo className="mb-6" />
            <h1 className="text-2xl font-bold text-ink-900">Sign in to your account</h1>
            <p className="mt-2 text-sm text-ink-500">Enter your email and password to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-error-50 border border-error-100 text-error-700 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
