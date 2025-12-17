'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils/date';
import EditFeedDialog from './EditFeedDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FeedRecord {
  _id: string;
  type: string;
  price: number;
  bags: number;
  kgPerBag: number;
  totalKg: number;
  date: string;
}

interface FeedListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FeedListDialog({ open, onOpenChange }: FeedListDialogProps) {
  const router = useRouter();
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<FeedRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedToDelete, setFeedToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchFeedRecords();
    }
  }, [open]);

  const fetchFeedRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/feed');
      const result = await response.json();
      if (result.success) {
        setFeedRecords(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch feed records:', error);
      toast.error('Failed to load feed records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (feed: FeedRecord) => {
    setSelectedFeed(feed);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchFeedRecords();
  };

  const handleDeleteClick = (id: string) => {
    setFeedToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!feedToDelete) return;

    try {
      const response = await fetch(`/api/feed/${feedToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete feed record');
      }

      toast.success('Feed record deleted successfully');
      fetchFeedRecords();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete feed record');
    } finally {
      setDeleteDialogOpen(false);
      setFeedToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feed Purchase Records</DialogTitle>
            <DialogDescription>View and manage your feed purchase history</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : feedRecords.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">No feed records found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Bags</TableHead>
                    <TableHead>KG/Bag</TableHead>
                    <TableHead>Total KG</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedRecords.map((feed) => (
                    <TableRow key={feed._id}>
                      <TableCell>{formatDate(new Date(feed.date), 'PP')}</TableCell>
                      <TableCell className="font-medium">{feed.type}</TableCell>
                      <TableCell>{feed.bags}</TableCell>
                      <TableCell>{feed.kgPerBag} kg</TableCell>
                      <TableCell>{feed.totalKg} kg</TableCell>
                      <TableCell>{formatCurrency(feed.price)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(feed)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(feed._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <EditFeedDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        feedRecord={selectedFeed}
        onSuccess={handleEditSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feed Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feed record
              and any associated transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFeedToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
