import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { SupplyTab } from '@/components/dashboard/SupplyTab';
import { SalesTab } from '@/components/dashboard/SalesTab';
import { InventoryTab } from '@/components/dashboard/InventoryTab';
import { BillingTab } from '@/components/dashboard/BillingTab';
import { SettingsTab } from '@/components/dashboard/SettingsTab';
import type { TabId } from '@/lib/types';

interface Props {
  onSignOut: () => void;
}

export function DashboardPage({ onSignOut }: Props) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Check if checkout success
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} onSignOut={onSignOut}>
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'supply' && <SupplyTab />}
      {activeTab === 'sales' && <SalesTab />}
      {activeTab === 'inventory' && <InventoryTab />}
      {activeTab === 'billing' && <BillingTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </DashboardLayout>
  );
}
