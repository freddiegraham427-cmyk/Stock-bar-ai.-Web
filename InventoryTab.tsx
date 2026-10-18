import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { formatUSD, formatNumber } from '@/lib/constants';
import type { Sale, Supply } from '@/lib/types';
import { Boxes, Search, Loader2, TrendingUp, TrendingDown, AlertTriangle, Package } from 'lucide-react';

interface InventoryItem {
  product_name: string;
  type: string;
  totalSupplied: number;
  totalSold: number;
  remaining: number;
  stockValue: number;
  costPerUnit: number;
  status: 'in-stock' | 'low' | 'out';
}

export function InventoryTab() {
  const { user } = useAuth();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [supRes, salesRes] = await Promise.all([
        supabase.from('barstock_supplies').select('*').eq('user_id', user.id),
        supabase.from('barstock_sales').select('*').eq('user_id', user.id),
      ]);
      setSupplies((supRes.data as Supply[]) || []);
      setSales((salesRes.data as Sale[]) || []);
      setLoading(false);
    })();
  }, [user]);

  const inventory = useMemo(() => {
    const map: Record<string, InventoryItem> = {};

    supplies.forEach((s) => {
      if (!map[s.product_name]) {
        map[s.product_name] = {
          product_name: s.product_name,
          type: s.type,
          totalSupplied: 0,
          totalSold: 0,
          remaining: 0,
          stockValue: 0,
          costPerUnit: Number(s.cost_price),
          status: 'in-stock',
        };
      }
      map[s.product_name].totalSupplied += s.qty_supplied;
      map[s.product_name].costPerUnit = Number(s.cost_price);
    });

    sales.forEach((s) => {
      if (!map[s.product_name]) {
        map[s.product_name] = {
          product_name: s.product_name,
          type: s.type,
          totalSupplied: 0,
          totalSold: 0,
          remaining: 0,
          stockValue: 0,
          costPerUnit: 0,
          status: 'out',
        };
      }
      map[s.product_name].totalSold += s.qty_sold;
    });

    Object.values(map).forEach((item) => {
      item.remaining = item.totalSupplied - item.totalSold;
      item.stockValue = Math.max(0, item.remaining) * item.costPerUnit;
      if (item.remaining <= 0) item.status = 'out';
      else if (item.remaining < 10) item.status = 'low';
      else item.status = 'in-stock';
    });

    return Object.values(map).sort((a, b) => a.product_name.localeCompare(b.product_name));
  }, [supplies, sales]);

  const filteredInventory = useMemo(() => {
    if (!search) return inventory;
    return inventory.filter((item) =>
      item.product_name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [inventory, search]);

  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const weeklyProductSales = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach((s) => {
      if (new Date(s.date) >= weekAgo) {
        map[s.product_name] = (map[s.product_name] || 0) + s.qty_sold;
      }
    });
    return map;
  }, [sales, weekAgo]);

  const topDemanded = useMemo(() => {
    return Object.entries(weeklyProductSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [weeklyProductSales]);

  const leastDemanded = useMemo(() => {
    return Object.entries(weeklyProductSales)
      .filter(([, qty]) => qty > 0)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5);
  }, [weeklyProductSales]);

  const outOfStock = useMemo(() => {
    return inventory.filter((item) => item.status === 'out');
  }, [inventory]);

  const statusBadge = (status: string) => {
    if (status === 'out') return 'bg-error-100 text-error-700';
    if (status === 'low') return 'bg-warning-100 text-warning-700';
    return 'bg-success-100 text-success-700';
  };

  const statusLabel = (status: string) => {
    if (status === 'out') return 'Out of Stock';
    if (status === 'low') return 'Low Stock';
    return 'In Stock';
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-500/10">
          <Boxes className="h-5 w-5 text-ink-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900">Inventory</h2>
          <p className="text-sm text-ink-500">Track remaining stock, demand, and alerts</p>
        </div>
      </div>

      {/* Insights sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top demanded */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-success-500" />
            <h3 className="text-sm font-bold text-ink-900">Top 5 Demanded This Week</h3>
          </div>
          {topDemanded.length > 0 ? (
            <div className="space-y-2">
              {topDemanded.map(([name, qty], i) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-success-50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500 text-white text-xs font-bold">{i + 1}</span>
                    <span className="text-sm font-medium text-ink-900">{name}</span>
                  </div>
                  <span className="text-sm font-bold text-success-600">{qty} units</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400 py-4 text-center">No sales this week yet</p>
          )}
        </div>

        {/* Least demanded */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-4 w-4 text-accent-500" />
            <h3 className="text-sm font-bold text-ink-900">Least Demanded This Week</h3>
          </div>
          {leastDemanded.length > 0 ? (
            <div className="space-y-2">
              {leastDemanded.map(([name, qty], i) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-accent-50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-white text-xs font-bold">{i + 1}</span>
                    <span className="text-sm font-medium text-ink-900">{name}</span>
                  </div>
                  <span className="text-sm font-bold text-accent-600">{qty} units</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400 py-4 text-center">No sales this week yet</p>
          )}
        </div>

        {/* Out of stock alerts */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-error-500" />
            <h3 className="text-sm font-bold text-ink-900">Out of Stock Alerts</h3>
          </div>
          {outOfStock.length > 0 ? (
            <div className="space-y-2">
              {outOfStock.map((item) => (
                <div key={item.product_name} className="flex items-center justify-between p-2 rounded-lg bg-error-50">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-error-500" />
                    <span className="text-sm font-medium text-ink-900">{item.product_name}</span>
                  </div>
                  <span className="text-xs font-bold text-error-600">RESTOCK</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400 py-4 text-center">Everything is in stock!</p>
          )}
        </div>
      </div>

      {/* Inventory table with search */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-ink-100 flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-sm font-bold text-ink-900">Inventory ({filteredInventory.length} items)</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-field !py-2 !pl-9 text-sm w-56"
            />
          </div>
        </div>

        {filteredInventory.length === 0 ? (
          <div className="p-12 text-center text-ink-400">
            <Boxes className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{search ? 'No products match your search.' : 'No inventory yet. Log supplies to get started.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-600">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Product</th>
                  <th className="text-left px-5 py-3 font-semibold">Type</th>
                  <th className="text-right px-5 py-3 font-semibold">Supplied</th>
                  <th className="text-right px-5 py-3 font-semibold">Sold</th>
                  <th className="text-right px-5 py-3 font-semibold">Remaining</th>
                  <th className="text-right px-5 py-3 font-semibold">Stock Value</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredInventory.map((item) => (
                  <tr key={item.product_name} className="hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-ink-900">{item.product_name}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.type === 'Drink' ? 'bg-brand-100 text-brand-700' : 'bg-success-100 text-success-700'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-ink-700">{formatNumber(item.totalSupplied)}</td>
                    <td className="px-5 py-3 text-right text-ink-700">{formatNumber(item.totalSold)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-ink-900">{formatNumber(item.remaining)}</td>
                    <td className="px-5 py-3 text-right text-ink-700">{formatUSD(item.stockValue)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
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
