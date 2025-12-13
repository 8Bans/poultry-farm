'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransactionDialog from '@/components/dialogs/TransactionDialog';
import FinancialSummary from '@/components/finances/FinancialSummary';
import TransactionsList from '@/components/finances/TransactionsList';
import FinancialCharts from '@/components/finances/FinancialCharts';

export default function FinancesClientWrapper() {
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDialogClose = (open: boolean) => {
    setTransactionDialogOpen(open);
    if (!open) {
      handleRefresh();
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setTransactionDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <FinancialSummary refreshKey={refreshKey} />

      <FinancialCharts refreshKey={refreshKey} />

      <TransactionsList refreshKey={refreshKey} onRefresh={handleRefresh} />

      <TransactionDialog open={transactionDialogOpen} onOpenChange={handleDialogClose} />
    </>
  );
}
