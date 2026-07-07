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
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useToken } from '@/hooks/useToken';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorName: string;
  tutorId: string;
}

export default function HireModal({ isOpen, onClose, tutorName, tutorId }: HireModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();
  const decoded = useToken();
  const pathname = usePathname();

  const isStudent = isAuthenticated && decoded?.role === 'student';
  const isNonStudent = isAuthenticated && decoded?.role && decoded.role !== 'student';
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || '/tutors')}`;

  const handleHire = async () => {
    setLoading(true);
    try {
      await makeAuthenticatedRequest('/api/hire', {
        method: 'POST',
        data: { teacherId: tutorId },
      });
      toast({
        title: 'Request sent',
        description: `Your hire request has been sent to ${tutorName}. They'll be notified to respond.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Could not send request',
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
            Hire {tutorName}
          </DialogTitle>
          <DialogDescription>
            {isStudent
              ? `Send a hire request to ${tutorName}. They'll review it and get back to you.`
              : isNonStudent
                ? 'Only student accounts can hire a tutor.'
                : 'Sign in as a student to send a hire request.'}
          </DialogDescription>
        </DialogHeader>

        {isStudent ? (
          <DialogFooter className="mt-4 gap-2 sm:gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-pill">
              Cancel
            </Button>
            <Button
              onClick={handleHire}
              disabled={loading}
              className="rounded-pill font-semibold shadow-glow"
            >
              {loading ? 'Sending…' : 'Send hire request'}
            </Button>
          </DialogFooter>
        ) : isNonStudent ? (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose} className="rounded-pill">
              Close
            </Button>
          </DialogFooter>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <Link href={loginHref} className="w-full">
              <Button className="w-full rounded-pill font-semibold shadow-glow">
                Log in to continue
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full rounded-pill font-semibold">
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
