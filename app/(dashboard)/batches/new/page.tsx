import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BatchCreateForm from '@/components/batches/BatchCreateForm';

export default async function NewBatchPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Batch</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add a new batch to start tracking your poultry
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
          <CardDescription>
            Enter the details for your new batch. A unique batch code will be automatically generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BatchCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}
