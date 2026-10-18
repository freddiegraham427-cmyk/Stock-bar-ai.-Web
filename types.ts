export interface Profile {
  id: string;
  business_name: string;
  plan: string;
  created_at: string;
}

export interface Supply {
  id: string;
  user_id: string;
  product_name: string;
  type: string;
  qty_supplied: number;
  cost_price: number;
  total_cost: number;
  supplier: string;
  date: string;
  created_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  product_name: string;
  type: string;
  qty_sold: number;
  selling_price: number;
  total: number;
  payment_method: string;
  date: string;
  created_at: string;
}

export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise';
export type TabId = 'overview' | 'supply' | 'sales' | 'inventory' | 'billing' | 'settings';
export type TimeFilter = 'today' | 'week' | 'month' | 'custom';
