'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/admin/DataTable';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { TuitionPreview } from '@/types/Tuition';

export default function TuitionDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [tuitions, setTuitions] = useState<TuitionPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tuition`);
        const data = await response.json();
        setTuitions(data);
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

    fetchTuitions();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tuition?')) return;

    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/tuition/${id}`, {
        method: 'DELETE',
      });

      setTuitions((prev) => prev.filter((tuition) => tuition.id !== id));
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

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'level', label: 'Level' },
    { key: 'status', label: 'Status' },
    { key: 'student', label: 'Student' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'createdAt', label: 'Created At' },
  ];

  const tableData = tuitions.map((tuition) => ({
    id: tuition.id,
    subject: tuition.subject,
    level: tuition.level,
    status: tuition.status,
    student: tuition.student ? `${tuition.student.firstName} ${tuition.student.lastName}` : 'N/A',
    teacher: tuition.teacher ? `${tuition.teacher.firstName} ${tuition.teacher.lastName}` : 'N/A',
    createdAt: new Date(tuition.createdAt).toLocaleDateString(),
  }));

  const handleView = (id: string) => {
    router.push(`/admin-dashboard/tuition/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/tuition/${id}/edit`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tuition Dashboard</h1>
      <div className="w-full flex justify-center">
        <DataTable
          data={tableData}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
