import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Mail, Lock, Store, Loader2, AlertCircle, Check } from 'lucide-react';

interface Props {
  onNavigate: (page: 'landing' | 'signin' | 'signup') => void;
}

export function SignUpPage({ onNavigate }: Props) {
  const { signUp } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(email, password, businessName);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50 p-6">
        <div className="card p-8 max-w-md text-center animate-scale-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-500/10 mb-4">
            <Check className="h-8 w-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-ink-900">Account created!</h2>
          <p className="mt-2 text-ink-500">Check your email to confirm your account, then sign in.</p>
          <button onClick={() => onNavigate('signin')} className="btn-primary w-full mt-6">
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <div className="mb-8">
            <Logo className="mb-6" />
            <h1 className="text-2xl font-bold text-ink-900">Start your free account</h1>
            <p className="mt-2 text-sm text-ink-500">No credit card needed. Free plan includes 50 sales per month.</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-error-50 border border-error-100 text-error-700 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Business Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. The Tipsy Lion Bar"
                  className="input-field pl-10"
                />
              </div>
            </div>

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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Free Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <button onClick={() => onNavigate('signin')} className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950/40" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-float" />

        <div className="relative max-w-md text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Everything you get for free</h2>

          <div className="mt-8 space-y-4 text-left">
            {[
              '1 shop with full supply & sales tracking',
              'Up to 50 sales per month',
              'Basic analytics dashboard',
              'Inventory management with stock alerts',
              'Real-time stock level calculations',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-brand-400" strokeWidth={3} />
                </div>
                <span className="text-ink-300">{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-ink-500">
            Upgrade anytime to unlock unlimited sales, AI predictions, and multi-branch support.
          </p>
        </div>
      </div>
    </div>
  );
}
