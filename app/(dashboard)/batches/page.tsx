import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import Batch from '@/lib/models/Batch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BatchList from '@/components/batches/BatchList';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getBatches(userId: string) {
  await connectDB();

  const batches = await Batch.find({ userId }).sort({ startDate: -1 }).lean();

  return batches.map((batch) => ({
    ...batch,
    _id: batch._id.toString(),
    userId: batch.userId.toString(),
    startDate: batch.startDate.toISOString(),
    createdAt: batch.createdAt.toISOString(),
    updatedAt: batch.updatedAt.toISOString(),
  }));
}

export default async function BatchesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const batches = await getBatches(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Batches</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your poultry batches
          </p>
        </div>
        <Link href="/batches/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Batch
          </Button>
        </Link>
      </div>

      <BatchList batches={batches} />
    </div>
  );
}
