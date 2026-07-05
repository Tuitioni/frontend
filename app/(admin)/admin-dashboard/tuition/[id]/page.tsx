'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { handleTokenError } from '@/lib/auth/admin';
import { Tuition } from '@/types/Tuition';

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
    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        className="rounded-pill"
        onClick={() => router.push(`/admin-dashboard/tuition/${params.id}/edit`)}
      >
        Edit
      </Button>
      <Button variant="destructive" className="rounded-pill" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tuition Details</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full details for {tuition.subject} tuition.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Teacher Information */}
        <AdminCard title="Teacher Information">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-lg font-semibold">
                {tuition.teacher.firstName} {tuition.teacher.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-lg font-semibold">{tuition.teacher.email}</p>
            </div>
          </div>
        </AdminCard>

        {/* Student Information */}
        <AdminCard title="Student Information">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-lg font-semibold">
                {tuition.student.firstName} {tuition.student.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-lg font-semibold">{tuition.student.email}</p>
            </div>
          </div>
        </AdminCard>

        {/* Tuition Details */}
        <AdminCard title="Tuition Details" footer={footer} className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Fee
              </p>
              <p className="mt-1 text-lg font-semibold tabular">৳{tuition.fee}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Payment ID
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {tuition.paymentId || 'Not assigned'}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {new Date(tuition.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Updated At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {new Date(tuition.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
