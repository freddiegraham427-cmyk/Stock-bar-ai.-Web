import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { formatUSD } from '@/lib/constants';
import type { Sale, Supply } from '@/lib/types';
import { ShoppingCart, Trash2, Loader2, Plus, Package, DollarSign, CreditCard, AlertCircle } from 'lucide-react';

export function SalesTab() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    product_name: '',
    type: 'Drink',
    qty_sold: '',
    selling_price: '',
    payment_method: 'Cash',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [salesRes, supRes] = await Promise.all([
        supabase.from('barstock_sales').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('barstock_supplies').select('*').eq('user_id', user.id),
      ]);
      setSales((salesRes.data as Sale[]) || []);
      setSupplies((supRes.data as Supply[]) || []);
      setLoading(false);
    })();
  }, [user]);

  const productNames = useMemo(() => {
    return [...new Set(supplies.map((s) => s.product_name))].sort();
  }, [supplies]);

  const stockMap = useMemo(() => {
    const map: Record<string, number> = {};
    supplies.forEach((s) => {
      map[s.product_name] = (map[s.product_name] || 0) + s.qty_supplied;
    });
    sales.forEach((s) => {
      map[s.product_name] = (map[s.product_name] || 0) - s.qty_sold;
    });
    return map;
  }, [supplies, sales]);

  const totalAmount = (Number(form.qty_sold) || 0) * (Number(form.selling_price) || 0);

  const handleProductChange = (name: string) => {
    const supply = supplies.find((s) => s.product_name === name);
    setForm({
      ...form,
      product_name: name,
      type: supply?.type || 'Drink',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.product_name || !form.qty_sold || !form.selling_price) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check stock
    const remaining = stockMap[form.product_name] || 0;
    if (remaining < Number(form.qty_sold)) {
      setError(`Not enough stock. You have ${remaining} ${form.product_name} remaining.`);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('barstock_sales').insert({
      product_name: form.product_name,
      type: form.type,
      qty_sold: Number(form.qty_sold),
      selling_price: Number(form.selling_price),
      total: totalAmount,
      payment_method: form.payment_method,
      date: form.date,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm({
      product_name: '', type: 'Drink', qty_sold: '', selling_price: '',
      payment_method: 'Cash', date: new Date().toISOString().split('T')[0],
    });
    const { data } = await supabase.from('barstock_sales').select('*').eq('user_id', user!.id).order('date', { ascending: false });
    setSales((data as Sale[]) || []);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('barstock_sales').delete().eq('id', id);
    setSales(sales.filter((s) => s.id !== id));
  };

  const paymentBadge = (method: string) => {
    const colors: Record<string, string> = {
      Cash: 'bg-success-100 text-success-700',
      Transfer: 'bg-accent-100 text-accent-700',
      Card: 'bg-brand-100 text-brand-700',
    };
    return colors[method] || colors.Cash;
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10">
          <ShoppingCart className="h-5 w-5 text-accent-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900">Sales Log</h2>
          <p className="text-sm text-ink-500">Record every sale — stock updates automatically</p>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-accent-500" />
          Record New Sale
        </h3>

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-error-50 border border-error-100 text-error-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Product Name</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <select
                value={form.product_name}
                onChange={(e) => handleProductChange(e.target.value)}
                className="input-field pl-9 appearance-none cursor-pointer"
              >
                <option value="">Select product...</option>
                {productNames.map((name) => (
                  <option key={name} value={name}>
                    {name} ({stockMap[name] || 0} in stock)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Type</label>
            <input type="text" value={form.type} disabled className="input-field !bg-ink-50 !text-ink-500 cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Quantity Sold</label>
            <input
              type="number"
              min="1"
              value={form.qty_sold}
              onChange={(e) => setForm({ ...form, qty_sold: e.target.value })}
              placeholder="e.g. 5"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Selling Price (per unit)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.selling_price}
                onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                placeholder="e.g. 5.00"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Payment Method</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="input-field pl-9 appearance-none cursor-pointer"
              >
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
                <option value="Card">Card</option>
              </select>
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

          <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between gap-4 pt-2">
            <div className="text-sm">
              <span className="text-ink-500">Total: </span>
              <span className="text-lg font-bold text-accent-500">{formatUSD(totalAmount)}</span>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>

      {/* Sales table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-ink-100">
          <h3 className="text-sm font-bold text-ink-900">All Sales ({sales.length})</h3>
        </div>
        {sales.length === 0 ? (
          <div className="p-12 text-center text-ink-400">
            <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No sales recorded yet. Record your first sale above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-600">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Product</th>
                  <th className="text-left px-5 py-3 font-semibold">Type</th>
                  <th className="text-right px-5 py-3 font-semibold">Qty</th>
                  <th className="text-right px-5 py-3 font-semibold">Price/Unit</th>
                  <th className="text-right px-5 py-3 font-semibold">Total</th>
                  <th className="text-left px-5 py-3 font-semibold">Payment</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-ink-900">{s.product_name}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.type === 'Drink' ? 'bg-brand-100 text-brand-700' : 'bg-success-100 text-success-700'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-ink-700">{s.qty_sold}</td>
                    <td className="px-5 py-3 text-right text-ink-700">{formatUSD(Number(s.selling_price))}</td>
                    <td className="px-5 py-3 text-right font-semibold text-ink-900">{formatUSD(Number(s.total))}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentBadge(s.payment_method)}`}>
                        {s.payment_method}
                      </span>
                    </td>
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
