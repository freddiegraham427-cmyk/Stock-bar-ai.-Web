import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { formatUSD } from '@/lib/constants';
import type { Supply, Sale, TimeFilter } from '@/lib/types';
import {
  DollarSign, TrendingUp, Wallet, CreditCard, Receipt, Boxes,
  BrainCircuit, ArrowUp, ArrowDown, Calendar, Loader2,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';

const BRAND_COLORS = ['#f77316', '#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

export function OverviewTab() {
  const { user } = useAuth();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TimeFilter>('today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [supRes, salesRes] = await Promise.all([
        supabase.from('barstock_supplies').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('barstock_sales').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      ]);
      setSupplies((supRes.data as Supply[]) || []);
      setSales((salesRes.data as Sale[]) || []);
      setLoading(false);
    })();
  }, [user]);

  const { startDate, endDate, prevStartDate, prevEndDate } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(today);
    end.setDate(end.getDate() + 1);

    if (filter === 'today') {
      const prev = new Date(today);
      prev.setDate(prev.getDate() - 1);
      return {
        startDate: today, endDate: end,
        prevStartDate: prev, prevEndDate: today,
      };
    }
    if (filter === 'week') {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      const prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 7);
      return {
        startDate: start, endDate: end,
        prevStartDate: prevStart, prevEndDate: start,
      };
    }
    if (filter === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const prevStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return {
        startDate: start, endDate: end,
        prevStartDate: prevStart, prevEndDate: start,
      };
    }
    // custom
    const s = customStart ? new Date(customStart) : new Date(today);
    const e = customEnd ? new Date(new Date(customEnd).getTime() + 86400000) : end;
    return { startDate: s, endDate: e, prevStartDate: s, prevEndDate: s };
  }, [filter, customStart, customEnd]);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const d = new Date(s.date);
      return d >= startDate && d < endDate;
    });
  }, [sales, startDate, endDate]);

  const filteredSupplies = useMemo(() => {
    return supplies.filter((s) => {
      const d = new Date(s.date);
      return d >= startDate && d < endDate;
    });
  }, [supplies, startDate, endDate]);

  const prevFilteredSales = useMemo(() => {
    return sales.filter((s) => {
      const d = new Date(s.date);
      return d >= prevStartDate && d < prevEndDate;
    });
  }, [sales, prevStartDate, prevEndDate]);

  const kpis = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalProfit = filteredSales.reduce((sum, s) => {
      const supply = supplies.find((sp) => sp.product_name === s.product_name);
      const costPerUnit = supply ? Number(supply.cost_price) : 0;
      return sum + (Number(s.total) - costPerUnit * s.qty_sold);
    }, 0);
    const cashTotal = filteredSales.filter((s) => s.payment_method === 'Cash').reduce((sum, s) => sum + Number(s.total), 0);
    const transferTotal = filteredSales.filter((s) => s.payment_method === 'Transfer').reduce((sum, s) => sum + Number(s.total), 0);
    const expenses = filteredSupplies.reduce((sum, s) => sum + Number(s.total_cost), 0);

    // stock value remaining
    const productMap: Record<string, { supplied: number; sold: number; cost: number }> = {};
    supplies.forEach((s) => {
      if (!productMap[s.product_name]) productMap[s.product_name] = { supplied: 0, sold: 0, cost: 0 };
      productMap[s.product_name].supplied += s.qty_supplied;
      productMap[s.product_name].cost = Number(s.cost_price);
    });
    sales.forEach((s) => {
      if (!productMap[s.product_name]) productMap[s.product_name] = { supplied: 0, sold: 0, cost: 0 };
      productMap[s.product_name].sold += s.qty_sold;
    });
    const stockValue = Object.entries(productMap).reduce((sum, [, v]) => {
      const remaining = v.supplied - v.sold;
      return sum + Math.max(0, remaining) * v.cost;
    }, 0);

    const prevTotalSales = prevFilteredSales.reduce((sum, s) => sum + Number(s.total), 0);
    const growthPct = prevTotalSales > 0 ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 : 0;

    return { totalSales, totalProfit, cashTotal, transferTotal, expenses, stockValue, growthPct };
  }, [filteredSales, filteredSupplies, prevFilteredSales, supplies, sales]);

  const cashTransferData = useMemo(() => {
    const cash = filteredSales.filter((s) => s.payment_method === 'Cash').reduce((sum, s) => sum + Number(s.total), 0);
    const transfer = filteredSales.filter((s) => s.payment_method === 'Transfer').reduce((sum, s) => sum + Number(s.total), 0);
    const card = filteredSales.filter((s) => s.payment_method === 'Card').reduce((sum, s) => sum + Number(s.total), 0);
    return [
      { name: 'Cash', value: cash },
      { name: 'Transfer', value: transfer },
      { name: 'Card', value: card },
    ].filter((d) => d.value > 0);
  }, [filteredSales]);

  const drinksVsFoodData = useMemo(() => {
    const drinks = filteredSales.filter((s) => s.type === 'Drink').reduce((sum, s) => sum + Number(s.total), 0);
    const food = filteredSales.filter((s) => s.type === 'Food').reduce((sum, s) => sum + Number(s.total), 0);
    return [
      { name: 'Drinks', value: drinks },
      { name: 'Food', value: food },
    ];
  }, [filteredSales]);

  const trendData = useMemo(() => {
    const days = filter === 'today' ? 1 : filter === 'week' ? 7 : filter === 'month' ? 30 : 7;
    const data: { date: string; sales: number; profit: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const daySales = sales.filter((s) => {
        const sd = new Date(s.date);
        return sd >= d && sd < next;
      });
      const dayTotal = daySales.reduce((sum, s) => sum + Number(s.total), 0);
      const dayProfit = daySales.reduce((sum, s) => {
        const supply = supplies.find((sp) => sp.product_name === s.product_name);
        const costPerUnit = supply ? Number(supply.cost_price) : 0;
        return sum + (Number(s.total) - costPerUnit * s.qty_sold);
      }, 0);
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: dayTotal,
        profit: dayProfit,
      });
    }
    return data;
  }, [sales, supplies, filter]);

  const aiAnalysis = useMemo(() => {
    // Top demanded this week
    const productSales: Record<string, number> = {};
    filteredSales.forEach((s) => {
      productSales[s.product_name] = (productSales[s.product_name] || 0) + s.qty_sold;
    });
    const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    const low = sorted[sorted.length - 1];

    // stock alerts
    const productMap: Record<string, { supplied: number; sold: number }> = {};
    supplies.forEach((s) => {
      if (!productMap[s.product_name]) productMap[s.product_name] = { supplied: 0, sold: 0 };
      productMap[s.product_name].supplied += s.qty_supplied;
    });
    sales.forEach((s) => {
      if (!productMap[s.product_name]) productMap[s.product_name] = { supplied: 0, sold: 0 };
      productMap[s.product_name].sold += s.qty_sold;
    });
    const outOfStock = Object.entries(productMap).filter(([, v]) => v.supplied - v.sold <= 0);

    const growth = kpis.growthPct;
    const growthText = growth > 0 ? `grew ${growth.toFixed(1)}%` : growth < 0 ? `dropped ${Math.abs(growth).toFixed(1)}%` : 'remained stable';
    const expectedProfit = Math.round(kpis.totalProfit * 7 / Math.max(1, trendData.length));

    const parts: string[] = [];
    parts.push(`Sales ${growthText} vs previous period.`);
    if (top) parts.push(`Top demanded: ${top[0]} (${top[1]} units).`);
    if (low) parts.push(`Low demand: ${low[0]} (${low[1]} units).`);
    if (top) parts.push(`Recommend restocking ${top[0]} soon.`);
    if (outOfStock.length > 0) parts.push(`Alert: ${outOfStock.length} item(s) out of stock.`);
    parts.push(`Expected profit this week ~$${expectedProfit}.`);

    return parts.join(' ');
  }, [filteredSales, supplies, sales, kpis, trendData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Sales', value: formatUSD(kpis.totalSales), icon: DollarSign, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { label: 'Total Profit', value: formatUSD(kpis.totalProfit), icon: TrendingUp, color: 'text-success-500', bg: 'bg-success-500/10' },
    { label: 'Cash Total', value: formatUSD(kpis.cashTotal), icon: Wallet, color: 'text-warning-500', bg: 'bg-warning-500/10' },
    { label: 'Transfer Total', value: formatUSD(kpis.transferTotal), icon: CreditCard, color: 'text-accent-500', bg: 'bg-accent-500/10' },
    { label: 'Expenses', value: formatUSD(kpis.expenses), icon: Receipt, color: 'text-error-500', bg: 'bg-error-500/10' },
    { label: 'Stock Value', value: formatUSD(kpis.stockValue), icon: Boxes, color: 'text-ink-600', bg: 'bg-ink-500/10' },
  ];

  const filterButtons: { id: TimeFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom Date' },
  ];

  return (
    <div className="space-y-6">
      {/* Time filter */}
      <div className="flex flex-wrap items-center gap-2">
        {filterButtons.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === f.id ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-ink-600 border border-ink-200 hover:border-brand-300'
            }`}
          >
            {f.label}
          </button>
        ))}
        {filter === 'custom' && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="input-field !py-2 !pl-9 text-sm" />
            </div>
            <span className="text-ink-400">to</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="input-field !py-2 !pl-9 text-sm" />
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="card p-4 hover:shadow-md transition-shadow">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg} mb-3`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <p className="text-xs text-ink-500 font-medium">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-ink-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Growth indicator */}
      <div className="card p-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpis.growthPct >= 0 ? 'bg-success-500/10' : 'bg-error-500/10'}`}>
          {kpis.growthPct >= 0 ? (
            <ArrowUp className="h-5 w-5 text-success-600" />
          ) : (
            <ArrowDown className="h-5 w-5 text-error-600" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900">
            {kpis.growthPct >= 0 ? '+' : ''}{kpis.growthPct.toFixed(1)}% growth vs previous period
          </p>
          <p className="text-xs text-ink-500">Compared to the same duration immediately before the selected period</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cash vs Transfer Pie */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-ink-900 mb-4">Cash vs Transfer</h3>
          {cashTransferData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={cashTransferData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                  {cashTransferData.map((_, i) => (
                    <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatUSD(Number(v))} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-ink-400 text-sm">No sales data yet</div>
          )}
        </div>

        {/* Drinks vs Food Bar */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-ink-900 mb-4">Drinks vs Food</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={drinksVsFoodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => formatUSD(Number(v))} />
              <Bar dataKey="value" fill="#f77316" radius={[8, 8, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Trend Line */}
        <div className="card p-5 lg:col-span-1 xl:col-span-1">
          <h3 className="text-sm font-bold text-ink-900 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => formatUSD(Number(v))} />
              <Line type="monotone" dataKey="sales" stroke="#f77316" strokeWidth={2.5} dot={{ r: 3 }} name="Sales" />
              <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="card p-5 bg-gradient-to-r from-brand-50 to-accent-50 border-brand-200">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20 flex-shrink-0">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-ink-900">AI Demand Analysis</h3>
              <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 text-[10px] font-bold uppercase">AI</span>
            </div>
            <p className="text-sm text-ink-700 leading-relaxed">{aiAnalysis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
