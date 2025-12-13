'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Batch {
  _id: string;
  batchCode: string;
  name: string;
}

interface BatchFilterProps {
  batches: Batch[];
}

export default function BatchFilter({ batches }: BatchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBatch = searchParams.get('batch') || 'all';

  const handleBatchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('batch');
    } else {
      params.set('batch', value);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="batch-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by Batch:
      </Label>
      <Select value={selectedBatch} onValueChange={handleBatchChange}>
        <SelectTrigger id="batch-filter" className="w-[280px]">
          <SelectValue placeholder="All Batches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Batches</SelectItem>
          {batches.map((batch) => (
            <SelectItem key={batch._id} value={batch._id}>
              {batch.name} ({batch.batchCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
