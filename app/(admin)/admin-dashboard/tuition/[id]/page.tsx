'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/adminCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { Tuition } from '@/types/Tuition';
import { handleTokenError } from '@/utils/auth';

export default function TuitionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTuition() {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/tuition/${params.id}`
        );
        const data = await response.json();
        setTuition(data);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }

    fetchTuition();
  }, [params.id, fetchWithAuth]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tuition?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuition/${params.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('jwt expired');
        }
        throw new Error('Failed to delete tuition');
      }

      toast({ title: 'Success', description: 'Tuition deleted successfully' });
      router.push('/admin-dashboard/tuition');
    } catch (error: any) {
      handleTokenError(error);
      toast({ title: 'Error', description: 'Failed to delete tuition', variant: 'destructive' });
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (!tuition) {
    return (
      <EmptyState
        title="Tuition not found"
        description="The tuition record you're looking for doesn't exist or has been removed."
      />
    );
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        onClick={() => router.push(`/admin-dashboard/tuition/${params.id}/edit`)}
      >
        Edit
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <AdminCard title="Tuition Details" footer={footer}>
        <div className="grid grid-cols-2 gap-8">
          {/* Teacher Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Teacher Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {tuition.teacher.firstName} {tuition.teacher.lastName}
              </p>
              <p>
                <strong>Email:</strong> {tuition.teacher.email}
              </p>
            </div>
          </div>

          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {tuition.student.firstName} {tuition.student.lastName}
              </p>
              <p>
                <strong>Email:</strong> {tuition.student.email}
              </p>
            </div>
          </div>

          {/* Tuition Details */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Tuition Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Fee:</strong> ৳{tuition.fee}
              </p>
              <p>
                <strong>Payment ID:</strong> {tuition.paymentId || 'Not assigned'}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(tuition.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(tuition.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
