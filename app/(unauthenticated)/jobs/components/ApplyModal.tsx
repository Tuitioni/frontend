'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useToken } from '@/hooks/useToken';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  defaultSalary?: number;
}

export default function ApplyModal({
  isOpen,
  onClose,
  postId,
  postTitle,
  defaultSalary,
}: ApplyModalProps) {
  const { toast } = useToast();
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();
  const decoded = useToken();
  const pathname = usePathname();

  const [salary, setSalary] = useState(defaultSalary ? String(defaultSalary) : '');
  const [loading, setLoading] = useState(false);

  const isTeacher = isAuthenticated && decoded?.role === 'teacher';
  const isNonTeacher = isAuthenticated && decoded?.role && decoded.role !== 'teacher';
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || '/jobs')}`;

  const handleApply = async () => {
    setLoading(true);
    try {
      await makeAuthenticatedRequest('/api/job', {
        method: 'POST',
        data: { postId, expected_salary: Number(salary) || 0 },
      });
      toast({
        title: 'Application sent',
        description: 'The student will see your application and can respond.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Could not apply',
        description:
          error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            Apply to this tuition
          </DialogTitle>
          <DialogDescription>
            {isTeacher
              ? postTitle
              : isNonTeacher
                ? 'Only tutor accounts can apply to tuition requests.'
                : 'Sign in as a tutor to apply.'}
          </DialogDescription>
        </DialogHeader>

        {isTeacher ? (
          <div className="mt-2 space-y-4">
            <div>
              <Label>Your expected salary (৳ / month)</Label>
              <Input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 7000"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="rounded-pill"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={loading || !salary}
                className="rounded-pill font-semibold shadow-glow"
              >
                {loading ? 'Sending…' : 'Send application'}
              </Button>
            </DialogFooter>
          </div>
        ) : isNonTeacher ? (
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={onClose} className="rounded-pill">
              Close
            </Button>
          </DialogFooter>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            <Link href={loginHref} className="w-full">
              <Button className="w-full rounded-pill font-semibold shadow-glow">
                Log in to apply
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full rounded-pill font-semibold">
                Sign up as a tutor
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
