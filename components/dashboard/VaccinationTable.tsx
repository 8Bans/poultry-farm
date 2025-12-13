'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils/date';

interface Vaccination {
  _id: string;
  vaccineName: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'pending' | 'completed' | 'overdue';
  batchId: {
    name: string;
  };
}

interface VaccinationTableProps {
  batchId?: string;
  refreshKey?: number;
}

export default function VaccinationTable({ batchId, refreshKey }: VaccinationTableProps) {
  const router = useRouter();
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVaccinations();
  }, [batchId, refreshKey]);

  const fetchVaccinations = async () => {
    try {
      const url = batchId ? `/api/vaccinations?batch=${batchId}` : '/api/vaccinations';
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setVaccinations(result.data.slice(0, 10));
      }
    } catch (error) {
      console.error('Failed to fetch vaccinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      const response = await fetch(`/api/vaccinations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark vaccination as completed');
      }

      toast.success('Vaccination marked as completed');
      fetchVaccinations();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update vaccination');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600">Overdue</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaccination Schedule</CardTitle>
        <CardDescription>Upcoming and recent vaccinations</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : vaccinations.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">No vaccinations scheduled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {!batchId && <TableHead>Batch</TableHead>}
                  <TableHead>Vaccine</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vaccinations.map((vaccination) => (
                  <TableRow key={vaccination._id}>
                    {!batchId && (
                      <TableCell className="font-medium">
                        {vaccination.batchId.name}
                      </TableCell>
                    )}
                    <TableCell>{vaccination.vaccineName}</TableCell>
                    <TableCell>
                      {formatDate(new Date(vaccination.scheduledDate), 'PP')}
                    </TableCell>
                    <TableCell>{getStatusBadge(vaccination.status)}</TableCell>
                    <TableCell>
                      {vaccination.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsCompleted(vaccination._id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Done
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
