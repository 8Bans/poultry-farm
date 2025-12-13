import { auth } from '@/lib/auth/auth';
import { redirect, notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongodb';
import Batch from '@/lib/models/Batch';
import BatchEditForm from '@/components/batches/BatchEditForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getBatch(batchId: string, userId: string) {
  await connectDB();

  const batch = await Batch.findOne({ _id: batchId, userId }).lean();

  if (!batch) {
    return null;
  }

  return {
    ...batch,
    _id: batch._id.toString(),
    userId: batch.userId.toString(),
    startDate: batch.startDate.toISOString().split('T')[0],
    createdAt: batch.createdAt.toISOString(),
    updatedAt: batch.updatedAt.toISOString(),
  };
}

export default async function BatchEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const { id } = await params;
  const batch = await getBatch(id, session.user.id);

  if (!batch) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/batches/${batch._id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Batch</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update batch information
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BatchEditForm batch={batch} />
        </CardContent>
      </Card>
    </div>
  );
}
