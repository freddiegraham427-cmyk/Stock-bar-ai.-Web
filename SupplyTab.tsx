import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { formatUSD } from '@/lib/constants';
import type { Supply } from '@/lib/types';
import { PackagePlus, Trash2, Loader2, Plus, Package, DollarSign, Store } from 'lucide-react';

export function SupplyTab() {
  const { user } = useAuth();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    product_name: '',
    type: 'Drink',
    qty_supplied: '',
    cost_price: '',
    supplier: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from('barstock_supplies')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .then(({ data }) => {
        setSupplies((data as Supply[]) || []);
        setLoading(false);
      });
  }, [user]);

  const totalCost = (Number(form.qty_supplied) || 0) * (Number(form.cost_price) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.product_name || !form.qty_supplied || !form.cost_price) {
      setError('Please fill in product name, quantity, and cost price.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('barstock_supplies').insert({
      product_name: form.product_name,
      type: form.type,
      qty_supplied: Number(form.qty_supplied),
      cost_price: Number(form.cost_price),
      total_cost: totalCost,
      supplier: form.supplier,
      date: form.date,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm({
      product_name: '', type: 'Drink', qty_supplied: '', cost_price: '', supplier: '',
      date: new Date().toISOString().split('T')[0],
    });
    // Refresh
    const { data } = await supabase.from('barstock_supplies').select('*').eq('user_id', user!.id).order('date', { ascending: false });
    setSupplies((data as Supply[]) || []);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('barstock_supplies').delete().eq('id', id);
    setSupplies(supplies.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
          <PackagePlus className="h-5 w-5 text-brand-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900">Supply Log</h2>
          <p className="text-sm text-ink-500">Record stock coming in from suppliers</p>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand-500" />
          Add New Supply
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-error-50 border border-error-100 text-error-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Product Name</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                placeholder="e.g. Star Beer"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input-field"
            >
              <option value="Drink">Drink</option>
              <option value="Food">Food</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Quantity</label>
            <input
              type="number"
              min="1"
              value={form.qty_supplied}
              onChange={(e) => setForm({ ...form, qty_supplied: e.target.value })}
              placeholder="e.g. 50"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Cost Price (per unit)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.cost_price}
                onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                placeholder="e.g. 2.50"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Supplier</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                placeholder="e.g. BrewCo Ltd"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Total cost display */}
          <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between gap-4 pt-2">
            <div className="text-sm">
              <span className="text-ink-500">Total Cost: </span>
              <span className="text-lg font-bold text-brand-500">{formatUSD(totalCost)}</span>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Add Supply'}
            </button>
          </div>
        </form>
      </div>

      {/* Supplies table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-ink-100">
          <h3 className="text-sm font-bold text-ink-900">All Supplies ({supplies.length})</h3>
        </div>
        {supplies.length === 0 ? (
          <div className="p-12 text-center text-ink-400">
            <PackagePlus className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No supplies logged yet. Add your first stock-in above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-600">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Product</th>
                  <th className="text-left px-5 py-3 font-semibold">Type</th>
                  <th className="text-right px-5 py-3 font-semibold">Qty</th>
                  <th className="text-right px-5 py-3 font-semibold">Cost/Unit</th>
                  <th className="text-right px-5 py-3 font-semibold">Total Cost</th>
                  <th className="text-left px-5 py-3 font-semibold">Supplier</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {supplies.map((s) => (
                  <tr key={s.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-ink-900">{s.product_name}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.type === 'Drink' ? 'bg-brand-100 text-brand-700' : 'bg-success-100 text-success-700'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-ink-700">{s.qty_supplied}</td>
                    <td className="px-5 py-3 text-right text-ink-700">{formatUSD(Number(s.cost_price))}</td>
                    <td className="px-5 py-3 text-right font-semibold text-ink-900">{formatUSD(Number(s.total_cost))}</td>
                    <td className="px-5 py-3 text-ink-600">{s.supplier || '-'}</td>
                    <td className="px-5 py-3 text-ink-500">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(s.id)} className="text-ink-400 hover:text-error-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
