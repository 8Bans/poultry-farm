'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface FeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FeedDialog({ open, onOpenChange }: FeedDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    price: '',
    bags: '',
    kgPerBag: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          price: parseFloat(formData.price),
          bags: parseInt(formData.bags),
          kgPerBag: parseFloat(formData.kgPerBag),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record feed purchase');
      }

      toast.success('Feed purchase recorded successfully');
      setFormData({ type: '', price: '', bags: '', kgPerBag: '' });
      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record feed purchase');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Feed Purchase</DialogTitle>
          <DialogDescription>Record feed purchase details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Feed Type</Label>
            <Input
              id="type"
              placeholder="e.g., Starter, Grower, Layer"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bags">Number of Bags</Label>
              <Input
                id="bags"
                type="number"
                min="1"
                value={formData.bags}
                onChange={(e) => setFormData({ ...formData, bags: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kgPerBag">KG per Bag</Label>
              <Input
                id="kgPerBag"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.kgPerBag}
                onChange={(e) => setFormData({ ...formData, kgPerBag: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Total Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 5000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Recording...' : 'Record Purchase'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
