'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { Teacher } from '@/types/teacher';

export default function TeacherDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/teacher/${params.id}`
        );
        const data = await response.json();
        setTeacher(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [fetchWithAuth, params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/teacher/${params.id}`, {
        method: 'DELETE',
      });
      router.push('/admin-dashboard/teacher');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (!teacher) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 sm:px-6">
        <h1 className="mb-4 text-2xl font-bold tracking-tight">Teacher not found</h1>
        <Button className="rounded-pill" onClick={() => router.push('/admin-dashboard/teacher')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Teacher Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Full details for {teacher.firstName} {teacher.lastName}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-pill"
            onClick={() => router.push('/admin-dashboard/teacher')}
          >
            Back
          </Button>
          <Button
            variant="outline"
            className="rounded-pill"
            onClick={() => router.push(`/admin-dashboard/teacher/${params.id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="destructive" className="rounded-pill" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <AdminCard title="Personal Information" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-lg font-semibold">
                {teacher.firstName} {teacher.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-lg font-semibold">{teacher.email}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Phone
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{teacher.phone}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Address
              </p>
              <p className="mt-1 text-lg font-semibold">{teacher.address}</p>
            </div>
          </div>
        </AdminCard>

        {/* Additional Information */}
        <AdminCard title="Additional Information" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {new Date(teacher.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last Updated
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {new Date(teacher.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
