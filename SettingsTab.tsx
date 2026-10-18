import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Settings as SettingsIcon, Store, Mail, Crown, Loader2, Check, AlertCircle } from 'lucide-react';

export function SettingsTab() {
  const { user, profile, refreshProfile } = useAuth();
  const [businessName, setBusinessName] = useState(profile?.business_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error } = await supabase
      .from('profiles')
      .update({ business_name: businessName })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    await refreshProfile();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-500/10">
          <SettingsIcon className="h-5 w-5 text-ink-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900">Settings</h2>
          <p className="text-sm text-ink-500">Manage your business profile</p>
        </div>
      </div>

      {/* Business profile */}
      <div className="card p-6 max-w-2xl">
        <h3 className="text-sm font-bold text-ink-900 mb-4">Business Profile</h3>

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-error-50 border border-error-100 text-error-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-success-50 border border-success-100 text-success-700 text-sm animate-fade-in">
            <Check className="h-5 w-5" />
            <span>Business name updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Business Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field pl-9 !bg-ink-50 !text-ink-500 cursor-not-allowed"
              />
            </div>
            <p className="mt-1 text-xs text-ink-400">Email cannot be changed here</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Current Plan</label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-ink-50 border border-ink-200">
              <Crown className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-semibold text-ink-900 capitalize">{profile?.plan || 'free'}</span>
              <span className="ml-auto text-xs text-ink-500">Manage in Billing tab</span>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card p-6 max-w-2xl border-error-200">
        <h3 className="text-sm font-bold text-error-700 mb-2">Danger Zone</h3>
        <p className="text-sm text-ink-500 mb-4">
          Account data is tied to your Supabase auth account. To delete your account and all data, please contact support.
        </p>
        <a href="mailto:support@barstock.ai" className="btn-secondary !border-error-200 !text-error-600 hover:!bg-error-50 text-sm">
          Contact Support
        </a>
      </div>
    </div>
  );
}
