'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuickActions from '@/components/dashboard/QuickActions';
import EggChart from '@/components/dashboard/EggChart';
import VaccinationCalendar from '@/components/dashboard/VaccinationCalendar';

interface DashboardClientWrapperProps {
  batchId?: string;
}

export default function DashboardClientWrapper({ batchId }: DashboardClientWrapperProps) {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    router.refresh();
  };

  return (
    <>
      <QuickActions onDataChange={handleRefresh} />

      <div className="grid grid-cols-1 gap-6">
        <EggChart batchId={batchId} refreshKey={refreshKey} />
        <VaccinationCalendar batchId={batchId} refreshKey={refreshKey} />
      </div>
    </>
  );
}
