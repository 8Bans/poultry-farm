'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, SkullIcon, Egg, Package, Syringe, ThermometerSun, List } from 'lucide-react';
import BatchDialog from '@/components/dialogs/BatchDialog';
import MortalityDialog from '@/components/dialogs/MortalityDialog';
import EggDialog from '@/components/dialogs/EggDialog';
import FeedDialog from '@/components/dialogs/FeedDialog';
import FeedListDialog from '@/components/dialogs/FeedListDialog';
import VaccinationDialog from '@/components/dialogs/VaccinationDialog';
import IncubatorDialog from '@/components/dialogs/IncubatorDialog';

interface QuickActionsProps {
  onDataChange?: () => void;
}

export default function QuickActions({ onDataChange }: QuickActionsProps) {
  const [batchOpen, setBatchOpen] = useState(false);
  const [mortalityOpen, setMortalityOpen] = useState(false);
  const [eggOpen, setEggOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const [feedListOpen, setFeedListOpen] = useState(false);
  const [vaccinationOpen, setVaccinationOpen] = useState(false);
  const [incubatorOpen, setIncubatorOpen] = useState(false);

  const handleDialogClose = (setter: (open: boolean) => void) => (open: boolean) => {
    setter(open);
    if (!open && onDataChange) {
      onDataChange();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your farm</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={() => setBatchOpen(true)} className="h-20 flex flex-col gap-2">
            <Plus className="h-5 w-5" />
            <span>New Batch</span>
          </Button>

          <Button
            onClick={() => setIncubatorOpen(true)}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <ThermometerSun className="h-5 w-5" />
            <span>Update Incubator</span>
          </Button>

          <Button
            onClick={() => setMortalityOpen(true)}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <SkullIcon className="h-5 w-5" />
            <span>Record Mortality</span>
          </Button>

          <Button
            onClick={() => setEggOpen(true)}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <Egg className="h-5 w-5" />
            <span>Log Eggs</span>
          </Button>

          <Button
            onClick={() => setFeedOpen(true)}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <Package className="h-5 w-5" />
            <span>Log Feed Purchase</span>
          </Button>

          <Button
            onClick={() => setFeedListOpen(true)}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <List className="h-5 w-5" />
            <span>Manage Feed Records</span>
          </Button>

          <Button
            onClick={() => setVaccinationOpen(true)}
            variant="outline"
            className="h-20 flex flex-col gap-2"
          >
            <Syringe className="h-5 w-5" />
            <span>Record Vaccination</span>
          </Button>
        </CardContent>
      </Card>

      <BatchDialog open={batchOpen} onOpenChange={handleDialogClose(setBatchOpen)} />
      <IncubatorDialog open={incubatorOpen} onOpenChange={handleDialogClose(setIncubatorOpen)} />
      <MortalityDialog open={mortalityOpen} onOpenChange={handleDialogClose(setMortalityOpen)} />
      <EggDialog open={eggOpen} onOpenChange={handleDialogClose(setEggOpen)} />
      <FeedDialog open={feedOpen} onOpenChange={handleDialogClose(setFeedOpen)} />
      <FeedListDialog open={feedListOpen} onOpenChange={handleDialogClose(setFeedListOpen)} />
      <VaccinationDialog open={vaccinationOpen} onOpenChange={handleDialogClose(setVaccinationOpen)} />
    </>
  );
}
