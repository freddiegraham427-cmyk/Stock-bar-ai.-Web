/*
# BarStock AI - Schema for Supply, Sales, and Inventory Tracking

## Purpose
AI Business Management SaaS for eateries, bars & restaurants.
Tracks supply (stock in), sales (stock out), inventory, and provides AI demand analysis.

## Tables

### profiles (already exists)
- Already has: id, business_name, plan, created_at
- No changes needed, just adding the handle_new_user trigger

### barstock_supplies (NEW - Stock In records)
- id, user_id, product_name, type (Drink/Food), qty_supplied, cost_price, total_cost, supplier, date, created_at

### barstock_sales (NEW - Stock Out records)
- id, user_id, product_name, type, qty_sold, selling_price, total, payment_method (Cash/Transfer/Card), date, created_at

## Security
- RLS enabled on all new tables
- Owner-scoped CRUD: each authenticated user can only access their own rows
- user_id defaults to auth.uid() so inserts that omit user_id still pass RLS

## Notes
1. Named barstock_* to avoid conflicts with existing StaffGuard tables (staff, clock_ins, sales)
2. handle_new_user trigger auto-creates a profile row on signup
*/

-- Handle new user trigger (profiles table already exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, business_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- BARSTOCK_SUPPLIES TABLE (Stock In)
CREATE TABLE IF NOT EXISTS barstock_supplies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  type text NOT NULL DEFAULT 'Drink',
  qty_supplied integer NOT NULL DEFAULT 0,
  cost_price numeric(12,2) NOT NULL DEFAULT 0,
  total_cost numeric(12,2) NOT NULL DEFAULT 0,
  supplier text DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE barstock_supplies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_supplies" ON barstock_supplies;
CREATE POLICY "select_own_supplies" ON barstock_supplies FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_supplies" ON barstock_supplies;
CREATE POLICY "insert_own_supplies" ON barstock_supplies FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_supplies" ON barstock_supplies;
CREATE POLICY "update_own_supplies" ON barstock_supplies FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_supplies" ON barstock_supplies;
CREATE POLICY "delete_own_supplies" ON barstock_supplies FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bs_supplies_user_id ON barstock_supplies(user_id);
CREATE INDEX IF NOT EXISTS idx_bs_supplies_date ON barstock_supplies(date);
CREATE INDEX IF NOT EXISTS idx_bs_supplies_product ON barstock_supplies(product_name);

-- BARSTOCK_SALES TABLE (Stock Out)
CREATE TABLE IF NOT EXISTS barstock_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  type text NOT NULL DEFAULT 'Drink',
  qty_sold integer NOT NULL DEFAULT 0,
  selling_price numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'Cash',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE barstock_sales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bs_sales" ON barstock_sales;
CREATE POLICY "select_own_bs_sales" ON barstock_sales FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bs_sales" ON barstock_sales;
CREATE POLICY "insert_own_bs_sales" ON barstock_sales FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bs_sales" ON barstock_sales;
CREATE POLICY "update_own_bs_sales" ON barstock_sales FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bs_sales" ON barstock_sales;
CREATE POLICY "delete_own_bs_sales" ON barstock_sales FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bs_sales_user_id ON barstock_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_bs_sales_date ON barstock_sales(date);
CREATE INDEX IF NOT EXISTS idx_bs_sales_product ON barstock_sales(product_name);
CREATE INDEX IF NOT EXISTS idx_bs_sales_payment ON barstock_sales(payment_method);
